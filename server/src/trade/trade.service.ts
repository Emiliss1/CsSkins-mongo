import { Injectable } from '@nestjs/common';
import { TradeRepository } from './trade.repository';
import { TradeSearchUserDto } from './dto/trade-search-user.dto';
import { User } from 'src/auth/user.schema';

@Injectable()
export class TradeService {
  constructor(private tradeRepository: TradeRepository) {}

  async searchUser(
    tradeSearchUserDto: TradeSearchUserDto,
    user: User,
  ): Promise<User[]> {
    return this.tradeRepository.searchUser(tradeSearchUserDto, user);
  }
}
