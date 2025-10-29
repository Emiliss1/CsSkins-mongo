import { Module } from '@nestjs/common';
import { SkinsController } from './skins.controller';
import { SkinsService } from './skins.service';
import { RolesGuard } from 'src/auth/roles.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Skin, skinSchema } from './skin-schema';
import { AuthModule } from 'src/auth/auth.module';
import { SkinsRepository } from './skins.repository';
import { User, UserSchema } from 'src/auth/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Skin.name, schema: skinSchema }]),
    AuthModule,
  ],
  controllers: [SkinsController],
  providers: [SkinsService, RolesGuard, SkinsRepository],
})
export class SkinsModule {}
