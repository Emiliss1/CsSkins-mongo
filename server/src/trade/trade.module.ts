import { Module } from '@nestjs/common';
import { TradeController } from './trade.controller';
import { TradeService } from './trade.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Trade, tradeSchema } from './trade.schema';
import { TradeRepository } from './trade.repository';
import { RolesGuard } from 'src/auth/roles.guard';
import { AuthModule } from 'src/auth/auth.module';
import { User, UserSchema } from 'src/auth/user.schema';
import { Skin, skinSchema } from 'src/skins/skin-schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Trade.name, schema: tradeSchema },
      { name: User.name, schema: UserSchema },
      { name: Skin.name, schema: skinSchema },
    ]),
    AuthModule,
  ],
  controllers: [TradeController],
  providers: [TradeService, TradeRepository, RolesGuard],
})
export class TradeModule {}
