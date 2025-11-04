import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type TradeDocument = HydratedDocument<Trade>;

@Schema()
export class Trade {
  @Prop({
    default: function genUUID() {
      return uuid();
    },
  })
  _id: string;
}

export const tradeSchema = SchemaFactory.createForClass(Trade);
