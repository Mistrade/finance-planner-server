import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import dayjs from 'dayjs';
import mongoose, { HydratedDocument, Model, SchemaTypes, Types } from 'mongoose';
import { Category } from '../category/category.model';
import { User } from '../profile/db_models/user.model';
import { Tag } from '../tags/tags.model';
import { Target } from '../targets/targets.model';
import { Wallet } from '../wallets/wallets.model';
import {
  OPERATION_DESCRIPTION_MAX_LENGTH,
  OPERATION_MAX_CATEGORIES,
  OPERATION_MAX_TAGS,
  OPERATION_MODEL_MESSAGES,
  OPERATION_REPEAT_PATTERNS,
  OPERATION_STATE,
  OPERATION_TITLE_MAX_LENGTH,
  OPERATION_TITLE_MIN_LENGTH,
  OPERATION_TYPES,
} from './operations.constants';

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
    minLength: OPERATION_TITLE_MIN_LENGTH,
    maxLength: OPERATION_TITLE_MAX_LENGTH,
  })
  @Prop({
    type: String,
    required: [true, OPERATION_MODEL_MESSAGES.TITLE_IS_REQUIRED],
    maxlength: [OPERATION_TITLE_MAX_LENGTH, OPERATION_MODEL_MESSAGES.TITLE_MAX_LENGTH],
    minlength: [OPERATION_TITLE_MIN_LENGTH, OPERATION_MODEL_MESSAGES.TITLE_MIN_LENGTH],
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
  @Prop({
    type: SchemaTypes.ObjectId,
    required: [true, OPERATION_MODEL_MESSAGES.USER_IS_REQUIRED],
    ref: User.name,
    validate: {
      validator: function (value: Types.ObjectId | string) {
        return mongoose.Types.ObjectId.isValid(value);
      },
      message: OPERATION_MODEL_MESSAGES.USER_SHOULD_BE_OBJECT_ID,
    },
  })
  user: Types.ObjectId;

  @ApiProperty({
    type: String,
    example: OPERATION_TYPES.INCOME,
    enum: Object.values(OPERATION_TYPES),
    description:
      'Тип операции. Указывает на то, как воспринимать системе значение cost, в виде дохода или в виде расхода.',
    required: true,
  })
  @Prop({
    type: String,
    required: [true, OPERATION_MODEL_MESSAGES.OPERATION_TYPE_IS_REQUIRED],
    enum: {
      values: Object.values(OPERATION_TYPES),
      message: OPERATION_MODEL_MESSAGES.OPERATION_TYPE_SHOULD_BE_ENUM,
    },
  })
  type: OPERATION_TYPES;

  @ApiProperty({
    name: 'wallet',
    default: new mongoose.Types.ObjectId(123),
    example: new mongoose.Types.ObjectId(123),
    type: String,
    required: true,
    nullable: false,
    description: 'Идентификатор модели кошелька',
  })
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Wallet.name,
    required: [true, OPERATION_MODEL_MESSAGES.WALLET_IS_REQUIRED],
  })
  wallet: Types.ObjectId;

  @ApiProperty({
    name: 'description',
    description: 'Подробное описание операции',
    example: 'Черный "Бородинский"',
    required: false,
    type: String,
    maxLength: OPERATION_DESCRIPTION_MAX_LENGTH,
  })
  @Prop({
    type: String,
    maxlength: [OPERATION_DESCRIPTION_MAX_LENGTH, OPERATION_MODEL_MESSAGES.DESCRIPTION_MAX_LENGTH],
  })
  description?: string;

  @ApiProperty({ name: 'cost', type: Number, required: true, description: 'Стоимость операции', example: 100 })
  @Prop({
    type: Number,
    required: [true, OPERATION_MODEL_MESSAGES.COST_IS_REQUIRED],
    default: 0,
  })
  cost: number;

  @ApiProperty({
    name: 'date',
    type: String,
    required: true,
    example: new Date().toISOString(),
    description: `Дата операции в ISO формате. По умолчанию - текущее UTC время, на момент создания операции.`,
  })
  @Prop({
    type: Date,
    required: [true, OPERATION_MODEL_MESSAGES.DATE_IS_REQUIRED],
    default() {
      return dayjs().utc().toDate();
    },
  })
  date: Date;

  @ApiProperty({
    name: 'state',
    enum: Object.values(OPERATION_STATE),
    required: true,
    type: String,
    default: OPERATION_STATE.REALISE,
    examples: Object.values(OPERATION_STATE),
    description: `Состояние операции. По умолчанию - ${OPERATION_STATE.REALISE}.`,
  })
  @Prop({
    type: String,
    enum: {
      values: Object.values(OPERATION_STATE),
      message: `Поле \"Состояние операции\" может быть одним из значений: ${Object.values(OPERATION_STATE)}`,
    },
    required: [true, OPERATION_MODEL_MESSAGES.STATE_IS_REQUIRED],
    default: OPERATION_STATE.REALISE,
  })
  state: OPERATION_STATE;

  @ApiProperty({
    name: 'repeat',
    required: true,
    default: false,
    example: false,
    type: Boolean,
    description: 'Флаг, указывающий на повторяемость операции. По умолчанию - false.',
  })
  @Prop({
    type: Boolean,
    required: [true, OPERATION_MODEL_MESSAGES.REPEAT_IS_REQUIRED],
    default(this: Operation) {
      return !!this.repeatPattern;
    },
  })
  repeat: boolean;

  @ApiProperty({
    name: 'repeatPattern',
    required: true,
    nullable: true,
    default: null,
    type: String,
    enum: Object.values(OPERATION_REPEAT_PATTERNS),
    examples: [null, ...Object.values(OPERATION_REPEAT_PATTERNS)],
    description: `Правило, описывающее, как применять повторяемость события.`,
  })
  @Prop({
    type: String,
    nullable: true,
    enum: {
      values: Object.values(OPERATION_REPEAT_PATTERNS).concat([null]),
      message: `Поле \"Частота повторений\" может принимать следующие значения: ${Object.values(
        OPERATION_REPEAT_PATTERNS,
      )}.`,
    },
    default: null,
  })
  repeatPattern: OPERATION_REPEAT_PATTERNS | null;

  @ApiProperty({
    name: 'endRepeatDate',
    required: true,
    default: null,
    type: String,
    examples: [new Date().toISOString(), null],
    description: `Конечная дата, до которой будет создаваться повторяемая операция.`,
  })
  @Prop({
    type: Date,
    nullable: true,
    default: null,
    required: false,
  })
  endRepeatDate: Date | null;

  @ApiProperty({
    name: 'repeatSource',
    required: true,
    nullable: true,
    type: String,
    examples: [new mongoose.Types.ObjectId(123), null],
    description: 'Ссылка на самую первую операцию, вызвавшую создание текущей (повторяемой) операции.',
  })
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Operation.name,
    nullable: true,
    default: null,
  })
  repeatSource?: Types.ObjectId | null;

  @ApiProperty({
    name: 'target',
    required: true,
    nullable: true,
    default: null,
    type: [Target],
    examples: [null, new mongoose.Types.ObjectId(321)],
    description: 'Заполненная модель цели, за которой будет закреплена создаваемая операция.',
  })
  @Prop({
    type: SchemaTypes.ObjectId,
    ref: Target.name,
    nullable: true,
    default: null,
  })
  target?: Types.ObjectId | null;

  @ApiProperty({
    name: 'category',
    required: true,
    default: [],
    type: [Category],
    example: [],
    maxLength: OPERATION_MAX_CATEGORIES,
    description: 'Массив заполненных моделей категорий, за которыми будет закреплена создаваемая операция.',
  })
  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: Category.name,
    default: [],
    maxlength: [OPERATION_MAX_CATEGORIES, OPERATION_MODEL_MESSAGES.CATEGORY_MAX_LENGTH],
  })
  category?: Array<Types.ObjectId>;

  @ApiProperty({
    name: 'tags',
    required: true,
    default: [],
    type: [Tag],
    example: [],
    maxLength: OPERATION_MAX_TAGS,
    description: `Массив заполненных моделей тегов, за которыми будет закреплена создаваемая операция.`,
  })
  @Prop({
    type: [SchemaTypes.ObjectId],
    ref: Tag.name,
    default: [],
    maxlength: [OPERATION_MAX_TAGS, OPERATION_MODEL_MESSAGES.TAGS_MAX_LENGTH],
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
