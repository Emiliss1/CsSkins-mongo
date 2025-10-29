import { IsNumber, IsOptional, IsPositive, IsString } from 'class-validator';

export class MarketSkinDto {
  @IsString()
  id: string;

  @IsNumber()
  @IsPositive()
  @IsOptional()
  price: number;
}
