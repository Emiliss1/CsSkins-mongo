import { Injectable } from '@nestjs/common';
import { SkinsRepository } from './skins.repository';
import { SkinsCreateDto } from './dto/skins.create.dto';
import { User } from 'src/auth/user.schema';
import { Skin } from './skin-schema';

@Injectable()
export class SkinsService {
  constructor(private skinsRepository: SkinsRepository) {}

  async createSkin(skinsCreateDto: SkinsCreateDto, user: User): Promise<void> {
    return this.skinsRepository.createSkin(skinsCreateDto, user);
  }

  async getSkins(user: User): Promise<Skin[]> {
    return this.skinsRepository.getSkins(user);
  }
}
