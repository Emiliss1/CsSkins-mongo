import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { TradeService } from './trade.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { TradeSearchUserDto } from './dto/trade-search-user.dto';
import { User } from 'src/auth/user.schema';
import { GetUser } from 'src/auth/get-user.decorator';
import { TradeGetUserDto } from './dto/trade-get-user.dto';
import { TradeCreateDto } from './dto/trade-create.dto';
import { Trade } from './trade.schema';
import { TradeTransferSkinsDto } from './dto/trade-transfer-skins.dto';

@Controller('trade')
@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.ADMIN, Role.USER)
export class TradeController {
  constructor(private tradeService: TradeService) {}

  @Get('/searchuser')
  searchUser(
    @Query() tradeSearchUserDto: TradeSearchUserDto,
    @GetUser() user: User,
  ): Promise<User[]> {
    return this.tradeService.searchUser(tradeSearchUserDto, user);
  }

  @Get('/getuser')
  getUserInventory(@Query() tradeGetUserDto: TradeGetUserDto): Promise<Object> {
    return this.tradeService.getUserInventory(tradeGetUserDto);
  }

  @Post('/createtrade')
  createTrade(
    @Body() tradeCreateDto: TradeCreateDto,
    @GetUser() user: User,
  ): Promise<void> {
    return this.tradeService.createTrade(tradeCreateDto, user);
  }

  @Get('/gettrades')
  getTradeOffers(@GetUser() user: User): Promise<Trade[]> {
    return this.tradeService.getTradeOffers(user);
  }

  @Post('/transferskins')
  transferTradeSkins(
    @GetUser() user: User,
    @Body() tradeTransferSkinsDto: TradeTransferSkinsDto,
  ): Promise<void> {
    return this.tradeService.transferTradeSkins(user, tradeTransferSkinsDto);
  }
}
