import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Model, SchemaTypes, Types } from 'mongoose';
import { Profile } from '../profile/profile.model';
import { CATEGORY_NAME_MAX_LENGTH, CATEGORY_NAME_MIN_LENGTH } from './category.constants';

export type TCategoryDocument = HydratedDocument<Category>;
export type TCategoryModel = Model<TCategoryDocument>;

@Schema({
  timestamps: true,
})
export class Category {
  @ApiProperty({
    name: 'name',
    type: String,
    description: 'Название категории',
    required: true,
    default: 'Автомобиль',
    minLength: CATEGORY_NAME_MIN_LENGTH,
    maxLength: CATEGORY_NAME_MAX_LENGTH,
  })
  @Prop({
    required: true,
    minlength: CATEGORY_NAME_MIN_LENGTH,
    maxlength: CATEGORY_NAME_MAX_LENGTH,
    type: String,
  })
  name: string;

  @ApiProperty({
    name: 'user',
    type: SchemaTypes.ObjectId,
    description: 'Идентификатор пользователя-владельца категории',
    required: true,
    default: new mongoose.Types.ObjectId(123),
  })
  @Prop({ type: SchemaTypes.ObjectId, ref: Profile.name, required: true })
  user: Types.ObjectId;

  @ApiProperty({
    name: '_id',
    default: new mongoose.Types.ObjectId(123),
    description: 'Идентификатор категории',
    required: true,
    type: SchemaTypes.ObjectId,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    name: 'createdAt',
    type: String,
    description: 'Дата создания категории в ISO формате',
    required: true,
    default: new Date().toISOString(),
  })
  createdAt: Date;
  
  @ApiProperty({
    name: 'updatedAt',
    type: String,
    description: 'Дата последнего обновления категории в ISO формате',
    required: true,
    default: new Date().toISOString(),
  })
  updatedAt: Date;
}

export const CategorySchema = SchemaFactory.createForClass(Category);
CategorySchema.index({ user: 1 });
