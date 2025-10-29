import { Injectable } from '@nestjs/common';
import { AdminRepository } from './admin.repository';
import { AdminFilterUserDto } from './dto/admin-filter-user.dto';
import { User } from 'src/auth/user.schema';
import { AdminUpdateUserBalanceDto } from './dto/admin-update-user-balance.dto';
import { AdminBanUserDto } from './dto/admin-ban-user.dto';

@Injectable()
export class AdminService {
  constructor(private adminRepository: AdminRepository) {}

  async findUser(adminFilterUserDto: AdminFilterUserDto): Promise<User[]> {
    return this.adminRepository.findUser(adminFilterUserDto);
  }

  async updateUserBalance(
    adminUpdateUserBalanceDto: AdminUpdateUserBalanceDto,
  ): Promise<string> {
    return this.adminRepository.updateUserBalance(adminUpdateUserBalanceDto);
  }

  async banUser(user: User, adminBanUserDto: AdminBanUserDto): Promise<string> {
    return this.adminRepository.banUser(user, adminBanUserDto);
  }
}
