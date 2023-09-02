import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Model, SchemaTypes, Types } from 'mongoose';
import { Profile } from '../profile/profile.model';
import { TAG_TITLE_MAX_LENGTH, TAG_TITLE_MIN_LENGTH } from './tags.constants';

export type TTagDocument = HydratedDocument<Tag>;
export type TTagModel = Model<TTagDocument>;

@Schema({
  timestamps: true,
})
export class Tag {
  @ApiProperty({
    name: 'title',
    description: 'Заголовок тега',
    required: true,
    default: 'example',
    minLength: TAG_TITLE_MIN_LENGTH,
    maxLength: TAG_TITLE_MAX_LENGTH,
  })
  @Prop({
    type: String,
    minlength: TAG_TITLE_MIN_LENGTH,
    maxlength: TAG_TITLE_MAX_LENGTH,
    required: true,
  })
  title: string;

  @ApiProperty({
    name: 'user',
    description: 'Идентификатор пользователя',
    required: true,
    type: String,
    default: new mongoose.Types.ObjectId(123),
  })
  @Prop({ type: SchemaTypes.ObjectId, ref: Profile.name, required: true })
  user: Types.ObjectId;
  
  @ApiProperty({
    name: "_id",
    description: "Уникальный идентификатор тега",
    required: true,
    type: String,
    default: new mongoose.Types.ObjectId(123),
  })
  _id: Types.ObjectId
  
  @ApiProperty({
    name: "createdAt",
    description: "Дата создания тега в ISO формате",
    type: String,
    default: new Date().toISOString(),
    required: true,
  })
  createdAt: Date;
  
  @ApiProperty({
    name: "updatedAt",
    description: "Дата последнего обновления тега в ISO формате",
    type: String,
    default: new Date().toISOString(),
    required: true,
  })
  updatedAt: Date;
}

export const TagSchema = SchemaFactory.createForClass(Tag);
