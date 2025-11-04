import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Trade, TradeDocument } from './trade.schema';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/auth/user.schema';
import { TradeSearchUserDto } from './dto/trade-search-user.dto';

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
}
