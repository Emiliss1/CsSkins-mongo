import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  PreconditionFailedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/user.schema';
import { UserUpdateBalanceDto } from './dto/user-update-balance.dto';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { Role } from 'src/auth/roles.enum';
import { JwtService } from '@nestjs/jwt';
import { UserUpdateUsernameDto } from './dto/user-update-username.dto';
import * as bcrypt from 'bcrypt';
import { JwtPayLoad } from 'src/auth/jwt-payload-interface';
import { UserUpdatePasswordDto } from './dto/user-update-password.dto';

@Injectable()
export class UserRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private schedulerRegistry: SchedulerRegistry,
    private jwtService: JwtService,
  ) {}

  async updateBalance(
    user: User,
    userUpdateBalanceDto: UserUpdateBalanceDto,
  ): Promise<{ newBalance }> {
    const { balance } = userUpdateBalanceDto;

    let newBalance: number = balance;

    if (!user) {
      throw new NotFoundException(`user not found`);
    }

    if (user.balance >= balance) {
      newBalance = user.balance -= balance;
      await this.userModel.updateOne(
        { _id: user._id },
        { balance: newBalance },
      );
    } else {
      throw new PreconditionFailedException(
        'Theres not enough money in your balance',
      );
    }

    return { newBalance };
  }

  async userBanTime(user: User): Promise<string> {
    const foundUser = await this.userModel.findOne({ _id: user._id });

    if (!foundUser) {
      throw new NotFoundException('user was not found');
    }

    if (user.role === 'banned' && +user.bannedTime > 0) {
      const banTime = +user.bannedTime - Date.now();
      if (banTime > 0) {
        const cronJobs = this.schedulerRegistry.getCronJobs();
        const cronJobsKeys = [...cronJobs.keys()]; //cron job names array
        const foundCronJob = cronJobsKeys.find((job) => job === user._id); //cron job name of user that tries to log in

        if (foundCronJob) return user.bannedTime;
        const job = new CronJob(
          new Date(Date.now() + banTime * 1000),
          async () => {
            this.schedulerRegistry.deleteCronJob(user._id);
            await this.userModel.findByIdAndUpdate(user._id, {
              role: Role.USER,
              bannedTime: '0',
            });
          },
        );

        this.schedulerRegistry.addCronJob(user._id, job);
        job.start();
        return user.bannedTime;
      } else {
        await this.userModel.findByIdAndUpdate(user._id, {
          role: Role.USER,
          bannedTime: '0',
        });
      }
    }
    return 'permanently banned';
  }

  async unbanUsers(): Promise<void> {
    const bannedUsers = await this.userModel.find({ role: 'banned' });

    (await bannedUsers).forEach(async (user) => {
      const banTime = +user.bannedTime - Date.now();

      const cronJobs = this.schedulerRegistry.getCronJobs();
      const cronJobsKeys = [...cronJobs.keys()];
      const foundCronJob = cronJobsKeys.find((job) => job === user._id);
      if (banTime > 0) {
        if (foundCronJob) return;
        const job = new CronJob(new Date(Date.now() + banTime), async () => {
          this.schedulerRegistry.deleteCronJob(user._id);

          await this.userModel.findByIdAndUpdate(user._id, {
            role: Role.USER,
            bannedTime: '0',
          });
        });

        this.schedulerRegistry.addCronJob(user._id, job);
        job.start();
      }
      if (banTime < 0 && +user.bannedTime !== 0) {
        if (foundCronJob) {
          this.schedulerRegistry.deleteCronJob(user.id);
        }
        await this.userModel.findByIdAndUpdate(user._id, {
          role: Role.USER,
          bannedTime: '0',
        });
      }
    });
  }

  async updateProfilePicture(
    user: User,
    file: Express.Multer.File,
  ): Promise<object> {
    if (!file) {
      throw new BadRequestException('no file found');
    }

    const allowedFileTypes = ['image/jpeg', 'image/png'];

    if (!allowedFileTypes.includes(file.mimetype)) {
      throw new BadRequestException('invalid file type');
    }

    await this.userModel.findByIdAndUpdate(user._id, {
      image: file.filename,
    });

    return { file: file.filename };
  }

  async updateUsername(
    user: User,
    userUpdateUsernameDto: UserUpdateUsernameDto,
  ): Promise<{ responseData: object }> {
    const { username, password } = userUpdateUsernameDto;

    const foundUser = await this.userModel
      .findOne({ _id: user._id })
      .select('+password');

    if (!foundUser) {
      throw new NotFoundException('user was not found');
    }

    if (user.username === username) {
      throw new BadRequestException("You can't use the same username");
    }

    if (user && (await bcrypt.compare(password, foundUser.password))) {
      try {
        const payload: JwtPayLoad = {
          username: username,
          role: user.role,
        };

        await this.userModel.findByIdAndUpdate(user._id, {
          username,
        });

        const accessToken = await this.jwtService.sign(payload);
        const responseData = {
          accessToken,
          message: 'Username was successfully changed',
          username: username,
        };

        return { responseData };
      } catch (err) {
        if (err.code === '23505') {
          throw new ConflictException('Username already exists');
        } else {
          throw new InternalServerErrorException();
        }
      }
    } else {
      throw new BadRequestException('Invalid password');
    }
  }

  async updatePassword(
    user: User,
    userUpdatePaswordDto: UserUpdatePasswordDto,
  ): Promise<string> {
    const { password, newPassword, confNewPassword } = userUpdatePaswordDto;

    const foundUser = await this.userModel
      .findOne({ _id: user._id })
      .select('+password');

    if (!foundUser) {
      throw new NotFoundException('user was not found');
    }

    if (user && (await bcrypt.compare(password, foundUser.password))) {
      if (newPassword === confNewPassword) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(newPassword, salt);
        await this.userModel.findByIdAndUpdate(user._id, {
          password: hashedPassword,
        });
      } else {
        throw new ConflictException("Confirm password doesn't match");
      }
    } else {
      throw new BadRequestException('Invalid current password');
    }
    return 'Password was successfully changed';
  }
}
