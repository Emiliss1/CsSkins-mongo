import { IsArray, IsObject, IsString } from 'class-validator';

export class TradeCreateDto {
  @IsArray()
  senderSkins: string[];

  @IsArray()
  receiverSkins: string[];

  @IsString()
  receiver: string;
}
