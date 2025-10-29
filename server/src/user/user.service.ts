import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from 'src/auth/user.schema';
import { UserUpdateBalanceDto } from './dto/user-update-balance.dto';
import { UserUpdateUsernameDto } from './dto/user-update-username.dto';
import { UserUpdatePasswordDto } from './dto/user-update-password.dto';

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async updateBalance(
    user: User,
    userUpdateBalanceDto: UserUpdateBalanceDto,
  ): Promise<{ newBalance }> {
    return this.userRepository.updateBalance(user, userUpdateBalanceDto);
  }

  userBanTime(user: User): Promise<string> {
    return this.userRepository.userBanTime(user);
  }

  async unbanUsers(): Promise<void> {
    return this.userRepository.unbanUsers();
  }

  async updateProfilePicture(
    user: User,
    file: Express.Multer.File,
  ): Promise<object> {
    return this.userRepository.updateProfilePicture(user, file);
  }

  async updateUsername(
    user: User,
    userUpdateUsernameDto: UserUpdateUsernameDto,
  ): Promise<{ responseData: object }> {
    return this.userRepository.updateUsername(user, userUpdateUsernameDto);
  }

  async updatePassword(
    user: User,
    userUpdatePasswordDto: UserUpdatePasswordDto,
  ): Promise<string> {
    return this.userRepository.updatePassword(user, userUpdatePasswordDto);
  }
}
