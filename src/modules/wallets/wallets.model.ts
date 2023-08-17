import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, {
  HydratedDocument,
  Model,
  SchemaTypes,
  Types,
} from 'mongoose';
import { User } from '../profile/db_models/user.model';
import {
  WALLET_CREATOR,
  WALLET_NAME_MAX_LENGTH,
  WALLET_NAME_MIN_LENGTH,
  WALLET_TYPE,
} from './wallets.constants';

export type TWalletDocument = HydratedDocument<
  Wallet,
  { createdAt: Date; updatedAt: Date }
>;
export type TWalletModel = Model<TWalletDocument>;

@Schema({
  timestamps: true,
})
export class Wallet {
  @ApiProperty({
    name: 'name',
    type: String,
    required: true,
    default: 'Название кошелька',
  })
  @Prop({
    type: String,
    required: true,
    minlength: WALLET_NAME_MIN_LENGTH,
    maxlength: WALLET_NAME_MAX_LENGTH,
  })
  name: string;

  @ApiProperty({ name: 'balance', type: Number, required: true, default: 0 })
  @Prop({ type: Number, required: true, default: 0 })
  balance: number;

  @ApiProperty({
    name: 'user',
    type: SchemaTypes.ObjectId,
    required: true,
    default: new mongoose.Types.ObjectId(123),
  })
  @Prop({ type: SchemaTypes.ObjectId, required: true, ref: User.name })
  user: Types.ObjectId;

  @ApiProperty({
    name: 'type',
    enum: Object.values(WALLET_TYPE),
    required: true,
    default: WALLET_TYPE.MONEY,
  })
  @Prop({
    type: String,
    enum: Object.values(WALLET_TYPE),
    required: true,
    default: WALLET_TYPE.MONEY,
  })
  type: WALLET_TYPE;

  @ApiProperty({
    name: 'deletable',
    required: true,
    default: false,
    type: Boolean,
  })
  @Prop({ type: Boolean, required: true, default: true })
  deletable: boolean;

  @ApiProperty({
    name: 'creator',
    required: true,
    default: WALLET_CREATOR.BASE,
    enum: Object.values(WALLET_CREATOR),
  })
  @Prop({ type: String, enum: Object.values(WALLET_CREATOR), required: true })
  creator: WALLET_CREATOR;

  @ApiProperty({
    type: Number,
    name: 'planningIncome',
    required: true,
    default: 0,
  })
  @Prop({ type: Number, required: true, default: 0 })
  planningIncome: number;

  @ApiProperty({
    type: Number,
    name: 'planningConsumption',
    required: true,
    default: 0,
  })
  @Prop({ type: Number, required: true, default: 0 })
  planningConsumption: number;

  @ApiProperty({
    type: String,
    name: 'createdAt',
    required: true,
    default: new Date().toISOString(),
  })
  createdAt?: Date;

  @ApiProperty({
    type: String,
    name: 'updatedAt',
    required: true,
    default: new Date().toISOString(),
  })
  updatedAt?: Date;

  @ApiProperty({
    type: SchemaTypes.ObjectId,
    name: '_id',
    required: true,
    default: new mongoose.Types.ObjectId(123),
  })
  _id?: Types.ObjectId;
}

export const WalletSchema = SchemaFactory.createForClass(Wallet);