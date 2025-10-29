import { IsEnum, IsNumber } from 'class-validator';

export class UserUpdateBalanceDto {
  @IsNumber()
  balance: number;
}
