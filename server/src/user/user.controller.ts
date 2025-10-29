import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/user.schema';
import { Roles } from 'src/auth/roles.decorator';
import { Role } from 'src/auth/roles.enum';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from 'src/auth/roles.guard';
import { UserService } from './user.service';
import { UserUpdateBalanceDto } from './dto/user-update-balance.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserUpdateUsernameDto } from './dto/user-update-username.dto';
import { UserUpdatePasswordDto } from './dto/user-update-password.dto';

@UseGuards(AuthGuard('jwt'), RolesGuard)
@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Roles(Role.BANNED, Role.USER, Role.ADMIN)
  @Get('/profile')
  getProfile(@GetUser() user: User) {
    // console.log(user);
    return {
      username: user.username,
      balance: user.balance,
      role: user.role,
      image: user.image,
    };
  }

  @Patch('/balance')
  updateBalance(
    @GetUser() user: User,
    @Body() userUpdateBalanceDto: UserUpdateBalanceDto,
  ): Promise<{ newBalance }> {
    return this.userService.updateBalance(user, userUpdateBalanceDto);
  }

  @Get('/bantime')
  userBanTime(@GetUser() user: User): Promise<string> {
    return this.userService.userBanTime(user);
  }

  @Get('/unbanusers')
  unbanUsers(): Promise<void> {
    return this.userService.unbanUsers();
  }

  @Post('/picture')
  @UseInterceptors(FileInterceptor('file'))
  updateProfilePicture(
    @GetUser() user: User,
    @UploadedFile()
    file: Express.Multer.File,
  ): Promise<object> {
    return this.userService.updateProfilePicture(user, file);
  }

  @Patch('/username')
  updateUsername(
    @GetUser() user: User,
    @Body() userUpdateUsernameDto: UserUpdateUsernameDto,
  ): Promise<{ responseData: object }> {
    return this.userService.updateUsername(user, userUpdateUsernameDto);
  }

  @Patch('/password')
  updatePassword(
    @GetUser() user: User,
    @Body() userUpdatePasswordDto: UserUpdatePasswordDto,
  ): Promise<string> {
    return this.userService.updatePassword(user, userUpdatePasswordDto);
  }
}
