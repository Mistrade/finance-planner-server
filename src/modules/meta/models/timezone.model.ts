import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model, Types } from 'mongoose';

export type TTimezoneDocument = HydratedDocument<Timezone>;
export type TTimezoneModel = Model<TTimezoneDocument>;

@Schema()
export class Timezone {
  @Prop({
    type: String,
    required: true,
  })
  countryCode: string;

  @Prop({
    type: String,
    required: true,
  })
  countryName: string;

  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  zoneName: string;

  @Prop({
    type: Number,
    required: true,
  })
  gmtOffset: number;

  _id: Types.ObjectId;
}

const TimezoneSchema = SchemaFactory.createForClass(Timezone);
TimezoneSchema.index({ zoneName: 1 });
TimezoneSchema.index({ gmtOffset: 1 });
export { TimezoneSchema };
