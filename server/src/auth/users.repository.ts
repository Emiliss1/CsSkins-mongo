import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './user.schema';
import { Model } from 'mongoose';
import { AuthRegisterDto } from './dto/auth-register.dto';
import * as bcrypt from 'bcrypt';
import { AuthLoginDto } from './dto/auth-login.dto';
import { JwtPayLoad } from './jwt-payload-interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private jwtService: JwtService,
  ) {}

  async createUser(authRegisterDto: AuthRegisterDto): Promise<void> {
    const { username, password, confPassword } = authRegisterDto;

    if (password === confPassword) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const user = new this.userModel({ username, password: hashedPassword });

      try {
        user.save();
      } catch (err) {
        if (err.code === '23505') {
          throw new ConflictException('Username already exists');
        } else {
          throw new InternalServerErrorException();
        }
      }
    } else {
      throw new ConflictException("Confirm password doesn't match");
    }
  }

  async signIn(authLoginDto: AuthLoginDto): Promise<{ accessToken: string }> {
    const { username, password } = authLoginDto;

    const user = await this.userModel.findOne({ username }).select('+password');
    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayLoad = {
        username: user.username,
        role: user.role,
      };
      const accessToken: string = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Password or username is invalid');
    }
  }
}
