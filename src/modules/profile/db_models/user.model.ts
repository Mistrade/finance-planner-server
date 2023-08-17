import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Model, Types } from "mongoose";
import { LOGIN_MAX_LENGTH_COUNT, LOGIN_MIN_LENGTH_COUNT } from '../../session/session.constants';

export type TUserDocument = HydratedDocument<User, any>;
export type TUserModel = Model<TUserDocument>;

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
export class User {
  @ApiProperty({
    name: 'email',
    type: String,
    required: true,
    description: "Email пользователя",
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
    name: "_id",
    type: String,
    description: "Идентификатор пользователя",
    example: new mongoose.Types.ObjectId(123),
    nullable: false,
    required: true,
  })
  _id: Types.ObjectId
  
  @ApiProperty({
    name: "createdAt",
    type: String,
    description: "Дата регистрации пользователя",
    example: new Date().toISOString(),
    nullable: false,
    required: true,
  })
  createdAt: Date;
  
  @ApiProperty({
    name: "updatedAt",
    type: String,
    description: "Дата последнего обновления информации о пользователе",
    example: new Date().toISOString(),
    nullable: false,
    required: true,
  })
  updatedAt: Date;
}

export const UserSchema = SchemaFactory.createForClass(User);
