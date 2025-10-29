import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Skin, SkinDocument } from 'src/skins/skin-schema';
import { MarketAddSkinDto } from './dto/market-add-skin.dto';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { User, UserDocument } from 'src/auth/user.schema';
import { MarketSkinDto } from './dto/market-skin.dto';

export class MarketRepository {
  constructor(
    @InjectModel(Skin.name) private skinModel: Model<SkinDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async addSkin(marketAddSkinDto: MarketAddSkinDto): Promise<string> {
    const { skinId: _id, inMarket, price } = marketAddSkinDto;

    const foundSkin = await this.skinModel.findOne({ _id });

    if (!foundSkin) {
      throw new NotFoundException('skin not found');
    }

    if (!foundSkin.inMarket) {
      foundSkin.inMarket = inMarket;
    }

    foundSkin.price = price;

    await foundSkin.save();

    return `${foundSkin.name} was added to the market`;
  }

  async getMarketSkins(): Promise<Skin[]> {
    return await this.skinModel
      .find({ inMarket: true })
      .lean()
      .populate('user');
  }

  async buyMarketSkin(
    marketSkinDto: MarketSkinDto,
    user: User,
  ): Promise<string> {
    const { id } = marketSkinDto;

    const foundSkin = await this.skinModel.findOne({ _id: id });

    if (!foundSkin || !user) {
      throw new NotFoundException('skin or user was not found');
    }

    if (user.balance >= foundSkin.price) {
      await this.userModel.findByIdAndUpdate(user._id, {
        balance: user.balance - foundSkin.price,
      });

      console.log(foundSkin);

      const foundUser = await this.userModel.findOne({
        _id: foundSkin.user,
      });

      if (!foundUser) {
        throw new NotFoundException('user was not found');
      }

      foundUser.balance += foundSkin.price;

      await foundUser.save();

      foundSkin.user = user;
      foundSkin.inMarket = false;
      foundSkin.price = 0;

      await foundSkin.save();

      return `You successfully bought ${foundSkin.name}`;
    } else {
      throw new BadRequestException(
        "You don't have enough money to buy this skin",
      );
    }
  }

  async getUserMarketSkins(user: User): Promise<Skin[]> {
    if (!user) {
      throw new NotFoundException('User was not found');
    }

    return await this.skinModel.find({ user: user._id, inMarket: true }).lean();
  }

  async updateSkinPrice(marketSkinDto: MarketSkinDto): Promise<string> {
    const { id, price } = marketSkinDto;

    const foundSkin = await this.skinModel.findByIdAndUpdate(id, {
      price,
    });

    if (!foundSkin) {
      throw new NotFoundException('Skin was not found');
    }

    return "Skin's price was successfully changed";
  }

  async removeSkin(marketSkinDto: MarketSkinDto): Promise<string> {
    const { id } = marketSkinDto;

    const foundSkin = await this.skinModel.findByIdAndUpdate(id, {
      price: 0,
      inMarket: false,
    });

    if (!foundSkin) {
      throw new NotFoundException('Skin was not found');
    }

    return 'you successfully removed skin from market';
  }
}
