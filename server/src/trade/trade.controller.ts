import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { TradeService } from './trade.service';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { TradeSearchUserDto } from './dto/trade-search-user.dto';
import { User } from 'src/auth/user.schema';
import { GetUser } from 'src/auth/get-user.decorator';

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
}
