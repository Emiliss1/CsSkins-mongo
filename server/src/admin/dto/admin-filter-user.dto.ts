import { IsNotEmpty, IsString } from 'class-validator';

export class AdminFilterUserDto {
  @IsNotEmpty()
  @IsString()
  search?: string;
}
