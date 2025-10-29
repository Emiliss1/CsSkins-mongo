import { IsNotEmpty, IsNumber, IsPositive, IsString } from 'class-validator';

export class AdminUpdateUserBalanceDto {
  @IsString()
  id: string;

  @IsNotEmpty()
  @IsPositive()
  @IsNumber()
  balance: number;
}
