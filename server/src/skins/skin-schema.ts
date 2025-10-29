import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Type } from 'class-transformer';
import mongoose, { HydratedDocument } from 'mongoose';
import { User } from 'src/auth/user.schema';
import { v4 as uuid } from 'uuid';

export type SkinDocument = HydratedDocument<Skin>;

@Schema()
export class Skin {
  @Prop({
    default: function genUUID() {
      return uuid();
    },
  })
  _id: string;

  @Prop()
  name: string;

  @Prop()
  image: string;

  @Prop()
  color: string;

  @Prop()
  rarity: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: false })
  inMarket: boolean;

  @Prop({ type: String, ref: 'User' })
  user: User;
}

export const skinSchema = SchemaFactory.createForClass(Skin);
