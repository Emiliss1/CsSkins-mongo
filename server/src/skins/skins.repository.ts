import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Skin, SkinDocument } from './skin-schema';
import { Model } from 'mongoose';
import { SkinsCreateDto } from './dto/skins.create.dto';
import { User, UserDocument } from 'src/auth/user.schema';

@Injectable()
export class SkinsRepository {
  constructor(
    @InjectModel(Skin.name) private skinModel: Model<SkinDocument>,
    @InjectModel(User.name) private userModel: Model<UserDocument>,
  ) {}

  async createSkin(skinsCreateDto: SkinsCreateDto, user: User): Promise<void> {
    const { name, image, color, rarity } = skinsCreateDto;

    const skin = new this.skinModel({
      name,
      image,
      color,
      rarity,
      user,
    });

    await skin.save();
  }

  async getSkins(user: User): Promise<Skin[]> {
    return this.skinModel.find({ user, inMarket: false }).lean();
  }
}
