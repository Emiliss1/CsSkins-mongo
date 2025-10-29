import { Injectable } from '@nestjs/common';
import { MarketRepository } from './market.repository';
import { MarketAddSkinDto } from './dto/market-add-skin.dto';
import { User } from 'src/auth/user.schema';
import { Skin } from 'src/skins/skin-schema';
import { MarketSkinDto } from './dto/market-skin.dto';

@Injectable()
export class MarketService {
  constructor(private marketRepository: MarketRepository) {}

  async addSkin(marketAddSkinDto: MarketAddSkinDto): Promise<string> {
    return this.marketRepository.addSkin(marketAddSkinDto);
  }

  async getMarketSkins(): Promise<Skin[]> {
    return this.marketRepository.getMarketSkins();
  }

  async buyMarketSkin(
    marketSkinDto: MarketSkinDto,
    user: User,
  ): Promise<string> {
    return this.marketRepository.buyMarketSkin(marketSkinDto, user);
  }

  async getUserMarketSkins(user: User): Promise<Skin[]> {
    return this.marketRepository.getUserMarketSkins(user);
  }

  async updateSkinPrice(marketSkinDto: MarketSkinDto): Promise<string> {
    return this.marketRepository.updateSkinPrice(marketSkinDto);
  }

  async removeSkin(marketSkinDto: MarketSkinDto): Promise<string> {
    return this.marketRepository.removeSkin(marketSkinDto);
  }
}
