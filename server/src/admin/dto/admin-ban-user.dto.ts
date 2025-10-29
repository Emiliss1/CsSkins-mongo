import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Role } from 'src/auth/roles.enum';

export class AdminBanUserDto {
  @IsString()
  id: string;

  @IsOptional()
  bannedTime: string;

  @IsEnum(Role)
  role: Role;
}
