import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { CasesModule } from './cases/cases.module';
import { SkinsModule } from './skins/skins.module';
import { AdminModule } from './admin/admin.module';
import { ScheduleModule } from '@nestjs/schedule';
import { MarketModule } from './market/market.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TradeModule } from './trade/trade.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],

      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_CONNECTION'),
      }),
      inject: [ConfigService],
    }),

    AuthModule,
    UserModule,
    CasesModule,
    SkinsModule,
    AdminModule,
    MarketModule,
    TradeModule,
  ],
})
export class AppModule {}
