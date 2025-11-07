import { IsString } from 'class-validator';

export class TradeTransferSkinsDto {
  @IsString()
  _id: string;
}
