import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import mongoose, { HydratedDocument, Model, Types } from 'mongoose';
import { Category } from '../category/category.model';
import { Tag } from '../tags/tags.model';
import { Target } from '../targets/targets.model';

export enum OPERATION_STATE {
  PLANNING = 'planning',
  REALISE = 'realise',
}

export enum OPERATION_REPEAT_PATTERNS {
  EVERY_DAY = 'every_day',
  EVERY_WEEK = 'every_week',
  EVERY_TWO_WEEK = 'every_two_week',
  EVERY_MONTH = 'every_month',
  EVERY_TWO_MONTH = 'every_two_month',
  EVERY_THREE_MONTH = 'every_three_month',
  EVERY_SIX_MONTH = 'every_six_month',
  EVERY_YEAR = 'every_year',
}

export type TDefaultOperationCountMap = {
  [key in OPERATION_REPEAT_PATTERNS]: number;
};

export const DEFAULT_REPEAT_OPERATION_COUNT_MAP: TDefaultOperationCountMap = {
  every_day: 30,
  every_week: 12,
  every_two_week: 12,
  every_month: 12,
  every_two_month: 6,
  every_three_month: 4,
  every_six_month: 4,
  every_year: 3,
};

export type TOperationDocument = HydratedDocument<Operation>;
export type TOperationModel = Model<TOperationDocument>;

@Schema({
  timestamps: true,
})
export class Operation {
  @ApiProperty({
    name: 'title',
    description: 'Название операции',
    example: 'Купить хлеб',
    type: String,
    required: true,
  })
  title: string;

  @ApiProperty({
    name: 'user',
    default: new mongoose.Types.ObjectId(123),
    example: new mongoose.Types.ObjectId(321),
    type: String,
    required: true,
    nullable: false,
    description: 'Уникальный идентификатор пользователя-владельца операции',
  })
  user: Types.ObjectId;

  @ApiProperty({
    name: 'description',
    description: 'Подробное описание операции',
    example: 'Черный "Бородинский"',
    required: false,
    type: String,
  })
  description?: string;

  @ApiProperty({ name: 'cost', type: Number, required: true, description: 'Стоимость операции', example: 100 })
  cost: number;

  @ApiProperty({
    name: 'date',
    type: String,
    required: false,
    example: new Date().toISOString(),
    description: `Дата операции в ISO формате. По умолчанию - текущее UTC время, на момент создания операции.`,
  })
  date: Date;

  @ApiProperty({
    name: 'state',
    enum: Object.values(OPERATION_STATE),
    required: false,
    type: String,
    default: OPERATION_STATE.REALISE,
    examples: Object.values(OPERATION_STATE),
    description: `Состояние операции. По умолчанию - ${OPERATION_STATE.REALISE}.`,
  })
  state: OPERATION_STATE;

  @ApiProperty({
    name: 'repeat',
    required: false,
    default: false,
    example: false,
    type: Boolean,
    description: 'Флаг, указывающий на повторяемость операции. По умолчанию - false.',
  })
  repeat: boolean;

  @ApiProperty({
    name: 'repeatPattern',
    required: false,
    nullable: true,
    default: null,
    type: String,
    enum: Object.values(OPERATION_REPEAT_PATTERNS),
    examples: [null, ...Object.values(OPERATION_REPEAT_PATTERNS)],
    description: `Правило, описывающее, как применять повторяемость события.`,
  })
  repeatPattern: OPERATION_REPEAT_PATTERNS | null;

  @ApiProperty({
    name: 'endRepeatDate',
    required: false,
    default: null,
    type: String,
    examples: [new Date().toISOString(), null],
    description: `Конечная дата, до которой будет создаваться повторяемая операция.`,
  })
  endRepeatDate: Date | null;

  @ApiProperty({
    name: 'repeatSource',
    required: false,
    nullable: true,
    type: String,
    examples: [new mongoose.Types.ObjectId(123), null],
    description: 'Ссылка на самую первую операцию, вызвавшую создание текущей (повторяемой) операции.',
  })
  repeatSource?: Types.ObjectId | null;

  @ApiProperty({
    name: 'target',
    required: false,
    nullable: true,
    default: null,
    type: [Target],
    examples: [null, new mongoose.Types.ObjectId(321)],
    description: 'Заполненная модель цели, за которой будет закреплена создаваемая операция.',
  })
  target?: Types.ObjectId | null;

  @ApiProperty({
    name: 'category',
    required: false,
    default: [],
    type: [Category],
    example: [],
    description: 'Массив заполненных моделей категорий, за которыми будет закреплена создаваемая операция.',
  })
  category?: Array<Types.ObjectId>;

  @ApiProperty({
    name: 'tags',
    required: false,
    default: [],
    type: [Tag],
    example: [null],
    description: `Массив заполненных моделей тегов, за которыми будет закреплена создаваемая операция.`,
  })
  tags?: Array<Types.ObjectId>;

  @ApiProperty({
    type: String,
    name: 'createdAt',
    required: true,
    default: new Date().toISOString(),
    description: 'Дата создания операции',
  })
  createdAt: Date;

  @ApiProperty({
    type: String,
    name: 'updatedAt',
    required: true,
    default: new Date().toISOString(),
    description: 'Дата последнего обновления операции',
  })
  updatedAt: Date;

  @ApiProperty({
    type: String,
    name: '_id',
    required: true,
    default: new mongoose.Types.ObjectId(123),
    description: 'Уникальный идентификатор операции',
  })
  _id: Types.ObjectId;
}

export const OperationSchema = SchemaFactory.createForClass(Operation);
