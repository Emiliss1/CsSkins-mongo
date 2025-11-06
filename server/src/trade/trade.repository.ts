import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trade, TradeDocument } from './trade.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/user.schema';
import { TradeSearchUserDto } from './dto/trade-search-user.dto';
import { TradeGetUserDto } from './dto/trade-get-user.dto';
import { TradeCreateDto } from './dto/trade-create.dto';

@Injectable()
export class TradeRepository {
  constructor(
    @InjectModel(Trade.name) private tradeModel: Model<TradeDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async searchUser(
    tradeSearchUserDto: TradeSearchUserDto,
    user: User,
  ): Promise<User[]> {
    const { search } = tradeSearchUserDto;

    const foundUsers = await this.userModel
      .find({
        username: { $regex: search, $options: 'i' },
      })
      .lean();

    const filteredUsers = foundUsers.filter(
      (userData) => userData.username !== user.username,
    );

    return filteredUsers;
  }

  async getUserInventory(tradeGetUserDto: TradeGetUserDto): Promise<User> {
    const { username } = tradeGetUserDto;

    const foundUser = await this.userModel
      .findOne({ username })
      .lean()
      .populate('skins');

    if (!foundUser) {
      throw new NotFoundException('User was not found');
    }

    return foundUser;
  }

  async createTrade(tradeCreateDto: TradeCreateDto, user: User): Promise<void> {
    const { senderSkins, receiverSkins, receiver } = tradeCreateDto;

    const foundReceiver = await this.userModel.findOne({ _id: receiver });

    if (!foundReceiver || !user) {
      throw new NotFoundException('user was not found');
    }

    if (senderSkins.length <= 0 && receiverSkins.length <= 0) {
      throw new BadRequestException(
        'You have to select atleast one skin from one inventory',
      );
    }

    const tradeData = new this.tradeModel({
      senderSkins,
      receiverSkins,
      sender: user,
      user: foundReceiver,
    });

    await tradeData.save();
  }
}
