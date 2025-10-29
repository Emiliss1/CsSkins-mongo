import { IsNotEmpty, IsString } from 'class-validator';

export class SkinsCreateDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsString()
  @IsNotEmpty()
  image: string;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsNotEmpty()
  rarity: string;
}
