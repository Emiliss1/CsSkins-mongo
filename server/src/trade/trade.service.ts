import { Injectable } from '@nestjs/common';
import { TradeRepository } from './trade.repository';
import { TradeSearchUserDto } from './dto/trade-search-user.dto';
import { User } from 'src/auth/user.schema';
import { TradeGetUserDto } from './dto/trade-get-user.dto';
import { TradeCreateDto } from './dto/trade-create.dto';
import { Trade } from './trade.schema';
import { TradeTransferSkinsDto } from './dto/trade-transfer-skins.dto';

@Injectable()
export class TradeService {
  constructor(private tradeRepository: TradeRepository) {}

  async searchUser(
    tradeSearchUserDto: TradeSearchUserDto,
    user: User,
  ): Promise<User[]> {
    return this.tradeRepository.searchUser(tradeSearchUserDto, user);
  }

  async getUserInventory(tradeGetUserDto: TradeGetUserDto): Promise<Object> {
    return this.tradeRepository.getUserInventory(tradeGetUserDto);
  }

  async createTrade(tradeCreateDto: TradeCreateDto, user: User): Promise<void> {
    return this.tradeRepository.createTrade(tradeCreateDto, user);
  }

  async getTradeOffers(user: User): Promise<Trade[]> {
    return this.tradeRepository.getTradeOffers(user);
  }

  async transferTradeSkins(
    user: User,
    tradeTransferSkinsDto: TradeTransferSkinsDto,
  ): Promise<void> {
    return this.tradeRepository.transferTradeSkins(user, tradeTransferSkinsDto);
  }
}
