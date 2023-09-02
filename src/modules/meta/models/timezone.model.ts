import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from "@nestjs/swagger";
import { HydratedDocument, Model, Types } from 'mongoose';

export type TTimezoneDocument = HydratedDocument<Timezone>;
export type TTimezoneModel = Model<TTimezoneDocument>;

@Schema()
export class Timezone {
  @ApiProperty({
    name: "countryCode",
    required: true,
    type: String,
    description: "Код страны"
  })
  @Prop({
    type: String,
    required: true,
  })
  countryCode: string;

  @ApiProperty({
    name: "countryName",
    required: true,
    type: String,
    description: "Полное название страны"
  })
  @Prop({
    type: String,
    required: true,
  })
  countryName: string;

  @ApiProperty({
    name: "zoneName",
    type: String,
    required: true,
    description: "Название часового пояса",
  })
  @Prop({
    type: String,
    required: true,
    unique: true,
  })
  zoneName: string;

  @ApiProperty({
    name: "gmtOffset",
    type: String,
    required: true,
    description: 'Смещение часового пояса от GMT в секундах.'
  })
  @Prop({
    type: Number,
    required: true,
  })
  gmtOffset: number;

  @ApiProperty({
    name: "_id",
    type: String,
    required: true,
    description: 'Уникальный идентификатор часового пояса.'
  })
  _id: Types.ObjectId;
}

const TimezoneSchema = SchemaFactory.createForClass(Timezone);
TimezoneSchema.index({ zoneName: 1 });
TimezoneSchema.index({ gmtOffset: 1 });
export { TimezoneSchema };
