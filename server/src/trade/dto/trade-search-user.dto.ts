import { IsString } from 'class-validator';

export class TradeSearchUserDto {
  @IsString()
  search: string;
}
