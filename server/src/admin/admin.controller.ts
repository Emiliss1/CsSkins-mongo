import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminFilterUserDto } from './dto/admin-filter-user.dto';
import { User } from 'src/auth/user.schema';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { AdminUpdateUserBalanceDto } from './dto/admin-update-user-balance.dto';
import { GetUser } from 'src/auth/get-user.decorator';
import { AdminBanUserDto } from './dto/admin-ban-user.dto';

@UseGuards(AuthGuard(), RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get()
  findUser(@Query() adminFilterUserDto: AdminFilterUserDto): Promise<User[]> {
    return this.adminService.findUser(adminFilterUserDto);
  }

  @Post('/updatebalance')
  updateUserBalance(
    @Body() adminUpdateUserBalanceDto: AdminUpdateUserBalanceDto,
  ): Promise<string> {
    return this.adminService.updateUserBalance(adminUpdateUserBalanceDto);
  }

  @Post('/ban')
  banUser(
    @GetUser() user: User,
    @Body() adminBanUserDto: AdminBanUserDto,
  ): Promise<string> {
    return this.adminService.banUser(user, adminBanUserDto);
  }
}
