import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/user.schema';
import { AdminFilterUserDto } from './dto/admin-filter-user.dto';
import { AdminUpdateUserBalanceDto } from './dto/admin-update-user-balance.dto';
import { NotFoundException, PreconditionFailedException } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { AdminBanUserDto } from './dto/admin-ban-user.dto';
import { Role } from 'src/auth/roles.enum';
import { CronJob } from 'cron';

export class AdminRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private schedulerRegistry: SchedulerRegistry,
  ) {}

  async findUser(adminFilterUserDto: AdminFilterUserDto): Promise<User[]> {
    const { search } = adminFilterUserDto;

    return await this.userModel
      .find({
        username: { $regex: search, $options: 'i' },
      })
      .lean();
  }

  async updateUserBalance(
    adminUpdateUserBalanceDto: AdminUpdateUserBalanceDto,
  ): Promise<string> {
    const { id, balance } = adminUpdateUserBalanceDto;

    const found = await this.userModel.findOne({ _id: id });

    if (!found) throw new NotFoundException(`user was not found`);

    found.balance = balance;

    found.save();

    return `user's (${found.username}) balance was updated`;
  }

  async banUser(user: User, adminBanUserDto: AdminBanUserDto): Promise<string> {
    const { id, role, bannedTime } = adminBanUserDto;

    const found = await this.userModel.findOne({ _id: id });

    const cronJobs = this.schedulerRegistry.getCronJobs();
    const cronJobKeys = [...cronJobs.keys()];

    if (!found) throw new NotFoundException(`user was not found`);

    if (role === 'user') {
      found.role = Role.BANNED;
      found.bannedTime = bannedTime;

      const foundCronJob = cronJobKeys.find((job) => job === found.id);

      const banTime = +bannedTime - Date.now();

      if (foundCronJob) {
        this.schedulerRegistry.deleteCronJob(found.id);
      }

      const job = new CronJob(new Date(Date.now() + banTime), async () => {
        found.role = Role.USER;
        found.bannedTime = '0';
        this.schedulerRegistry.deleteCronJob(found.id);
        await found.save();
      });

      this.schedulerRegistry.addCronJob(found.id, job);
      job.start();

      await found.save();
      return `You successfully banned user (${found.username})`;
    }
    if (role === 'banned') {
      found.role = Role.USER;
      found.bannedTime = '0';

      const foundCronJob = cronJobKeys.find((job) => job === found.id);

      if (foundCronJob) {
        this.schedulerRegistry.deleteCronJob(found.id);
      }

      await found.save();
      return `You successfully unbanned user (${found.username})`;
    }
    if (!user) {
      throw new NotFoundException(`user was not found`);
    }
    if (id === user._id) {
      throw new PreconditionFailedException("You can't ban yourself");
    }
    if (role === 'admin') {
      throw new PreconditionFailedException("you can't ban an administrator");
    }

    return 'User has been banned';
  }
}
