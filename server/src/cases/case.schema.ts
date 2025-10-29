import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { v4 as uuid } from 'uuid';

export type CaseDocument = HydratedDocument<Case>;

@Schema()
export class Case {
  @Prop({
    default: function genUUID() {
      return uuid();
    },
  })
  _id: string;

  @Prop()
  caseId: string;

  @Prop()
  image: string;

  @Prop()
  name: string;

  @Prop()
  price: number;
}

export const CaseSchema = SchemaFactory.createForClass(Case);
