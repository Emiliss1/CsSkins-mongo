import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/user.schema';
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

  @Prop()
  senderSkins: string[];

  @Prop()
  receiverSkins: string[];

  @Prop({ type: String, ref: 'User' })
  sender: User;

  @Prop({ type: String, ref: 'User' })
  user: User;
}

export const tradeSchema = SchemaFactory.createForClass(Trade);
