import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Exclude, Type } from 'class-transformer';
import mongoose, { HydratedDocument, Mongoose } from 'mongoose';
import { v4 as uuid } from 'uuid';
import { Role } from './roles.enum';
import { Skin } from 'src/skins/skin-schema';
import { ExcludeProperty } from 'nestjs-mongoose-exclude';
import { Trade } from 'src/trade/trade.schema';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({
    type: String,
    default: function genUUID() {
      return uuid();
    },
  })
  _id: string;

  @Prop({ unique: true })
  username: string;

  @Prop({ select: false })
  password: string;

  @Prop({ default: 20 })
  balance: number;

  @Prop({ default: Role.USER })
  role: Role;

  @Prop({ type: String, default: 0 })
  bannedTime: string;

  @Prop({ default: '' })
  image: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
