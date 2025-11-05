import { IsNotEmpty, IsString } from 'class-validator';

export class TradeGetUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;
}
