import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
} from 'class-validator';

export class MarketAddSkinDto {
  @IsString()
  skinId: string;

  @IsBoolean()
  inMarket: boolean;

  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  price: number;
}
