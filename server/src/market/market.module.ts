import { Module } from '@nestjs/common';
import { MarketController } from './market.controller';
import { MarketService } from './market.service';
import { MarketRepository } from './market.repository';
import { RolesGuard } from 'src/auth/roles.guard';
import { MongooseModule } from '@nestjs/mongoose';
import { Skin, skinSchema } from 'src/skins/skin-schema';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/auth/user.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Skin.name, schema: skinSchema },
      { name: User.name, schema: UserSchema },
    ]),
    AuthModule,
  ],
  controllers: [MarketController],
  providers: [MarketService, MarketRepository, RolesGuard],
})
export class MarketModule {}
