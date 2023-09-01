import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Model, SchemaTypes, Types } from 'mongoose';
import { IGetIpData } from '../meta/meta.types';
import { LOGIN_MAX_LENGTH_COUNT, LOGIN_MIN_LENGTH_COUNT } from '../session/session.constants';
import { SYSTEM_ROOTS } from './profile.constants';

export type TProfileDocument = HydratedDocument<Profile, any>;
export type TProfileModel = Model<TProfileDocument>;

@Schema({
  timestamps: true,
  toJSON: {
    transform(data, doc) {
      delete doc.passwordHash;
      delete doc.__v;
      return doc;
    },
  },
})
export class Profile {
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
    description: 'Email пользователя',
    example: 'example@example.com',
    nullable: false,
  })
  @Prop({
    required: true,
    type: String,
    unique: true,
    minlength: LOGIN_MIN_LENGTH_COUNT,
    maxlength: LOGIN_MAX_LENGTH_COUNT,
  })
  email: string;

  @Prop({ required: true, type: String })
  passwordHash: string;

  @ApiProperty({
    name: '_id',
    type: String,
    description: 'Идентификатор пользователя',
    example: new mongoose.Types.ObjectId(123),
    nullable: false,
    required: true,
  })
  _id: Types.ObjectId;

  @ApiProperty({
    name: 'createdAt',
    type: String,
    description: 'Дата регистрации пользователя',
    example: new Date().toISOString(),
    nullable: false,
    required: true,
  })
  createdAt: Date;

  @ApiProperty({
    name: 'updatedAt',
    type: String,
    description: 'Дата последнего обновления информации о пользователе',
    example: new Date().toISOString(),
    nullable: false,
    required: true,
  })
  updatedAt: Date;

  //new fields
  @ApiProperty({
    name: 'systemRoot',
    type: String,
    enum: Object.values(SYSTEM_ROOTS),
    description: 'Права пользователя на уровне системы - либо администратор приложения, либо клиент',
    example: SYSTEM_ROOTS.CLIENT,
    default: SYSTEM_ROOTS.CLIENT,
    nullable: false,
    required: true,
  })
  @Prop({
    type: String,
    enum: Object.values(SYSTEM_ROOTS),
    required: true,
  })
  systemRoot: SYSTEM_ROOTS;

  @ApiProperty({
    name: 'subscribe',
    type: String,
    description: 'Название тарифного плана',
    required: false,
  })
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: 'subscribe',
    required: false,
    default: null,
  })
  //TODO
  subscribe: Types.ObjectId | null;
}

export const UserSchema = SchemaFactory.createForClass(Profile);
