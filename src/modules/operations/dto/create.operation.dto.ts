import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEmpty,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import mongoose from 'mongoose';
import {
  DEFAULT_REPEAT_OPERATION_COUNT_MAP,
  OPERATION_DESCRIPTION_MAX_LENGTH,
  OPERATION_MAX_CATEGORIES,
  OPERATION_MAX_TAGS,
  OPERATION_MODEL_MESSAGES,
  OPERATION_REPEAT_PATTERNS,
  OPERATION_STATE,
  OPERATION_TITLE_MAX_LENGTH,
  OPERATION_TITLE_MIN_LENGTH,
  OPERATION_TYPES,
} from '../operations.constants';

export class CreateOperationDto {
  @ApiProperty({
    name: 'title',
    description: 'Название операции',
    example: 'Купить хлеб',
    type: String,
    required: true,
  })
  @IsString({ message: OPERATION_MODEL_MESSAGES.TITLE_SHOULD_BE_STRING })
  @MaxLength(OPERATION_TITLE_MAX_LENGTH, { message: OPERATION_MODEL_MESSAGES.TITLE_MAX_LENGTH })
  @MinLength(OPERATION_TITLE_MIN_LENGTH, { message: OPERATION_MODEL_MESSAGES.TITLE_MIN_LENGTH })
  title: string;

  @ApiProperty({
    name: 'wallet',
    default: new mongoose.Types.ObjectId(123),
    example: new mongoose.Types.ObjectId(123),
    type: String,
    required: true,
    nullable: false,
    description: 'Идентификатор модели кошелька',
  })
  @IsString({ message: OPERATION_MODEL_MESSAGES.DTO_WALLET_SHOULD_BE_STRING })
  wallet: string;

  @ApiProperty({
    name: 'type',
    example: OPERATION_TYPES.INCOME,
    enum: Object.values(OPERATION_TYPES),
    required: true,
    description: 'Тип операции: Доход или расход.',
  })
  @IsEnum(OPERATION_TYPES, { message: OPERATION_MODEL_MESSAGES.OPERATION_TYPE_SHOULD_BE_ENUM })
  type: OPERATION_TYPES;

  @ApiProperty({
    name: 'description',
    description: 'Подробное описание операции',
    example: 'Черный "Бородинский"',
    required: false,
    type: String,
  })
  @IsString({ message: OPERATION_MODEL_MESSAGES.DESCRIPTION_SHOULD_BE_STRING })
  @MaxLength(OPERATION_DESCRIPTION_MAX_LENGTH, { message: OPERATION_MODEL_MESSAGES.DESCRIPTION_MAX_LENGTH })
  @IsOptional()
  description?: string;

  @ApiProperty({ name: 'cost', type: Number, required: true, description: 'Стоимость операции', example: 100 })
  @IsNumber({}, { message: OPERATION_MODEL_MESSAGES.COST_SHOULD_BE_NUMBER })
  cost: number;

  @ApiProperty({
    name: 'date',
    type: String,
    required: false,
    example: new Date().toISOString(),
    description: `Дата операции в ISO формате. По умолчанию - текущее UTC время, на момент создания операции.`,
  })
  @IsDateString({}, { message: OPERATION_MODEL_MESSAGES.DATE_IS_INVALID })
  @IsOptional()
  date?: string;

  @ApiProperty({
    name: 'state',
    enum: Object.values(OPERATION_STATE),
    required: false,
    type: String,
    examples: Object.values(OPERATION_STATE),
    default: OPERATION_STATE.REALISE,
    description: `Состояние операции: Запланировано(${OPERATION_STATE.PLANNING}) или реализовано(${OPERATION_STATE.REALISE}). По умолчанию - ${OPERATION_STATE.REALISE}`,
  })
  @IsEnum(OPERATION_STATE, { message: OPERATION_MODEL_MESSAGES.STATE_IS_INVALID })
  @IsOptional()
  state?: OPERATION_STATE;

  @ApiProperty({
    name: 'repeat',
    required: false,
    default: false,
    example: false,
    type: Boolean,
    description: 'Флаг, указывающий на повторяемость операции. По умолчанию - false.',
  })
  @IsOptional()
  @IsBoolean({ message: OPERATION_MODEL_MESSAGES.REPEAT_IS_INVALID })
  repeat?: boolean;

  @ApiProperty({
    name: 'repeatPattern',
    required: false,
    default: OPERATION_REPEAT_PATTERNS.EVERY_WEEK,
    type: String,
    enum: Object.values(OPERATION_REPEAT_PATTERNS),
    examples: Object.values(OPERATION_REPEAT_PATTERNS),
    description: `Правило, описывающее, как применять повторяемость события.`,
  })
  @IsOptional()
  @IsEnum(OPERATION_REPEAT_PATTERNS, { message: OPERATION_MODEL_MESSAGES.REPEAT_PATTERN_IS_INVALID })
  repeatPattern?: OPERATION_REPEAT_PATTERNS;

  @ApiProperty({
    name: 'endRepeatDate',
    required: false,
    default: new Date().toISOString(),
    type: String,
    example: new Date().toISOString(),
    description: `Конечная дата, до которой будет создаваться повторяемая операция. По умолчанию (если не передано) будет выбрано из: ${JSON.stringify(
      DEFAULT_REPEAT_OPERATION_COUNT_MAP,
    )} по значению, хранящемуся в repeatPattern ключе.`,
  })
  @IsOptional()
  @IsDateString({}, { message: OPERATION_MODEL_MESSAGES.END_REPEAT_DATE_IS_INVALID })
  endRepeatDate?: string;

  @ApiProperty({
    name: 'target',
    required: false,
    nullable: true,
    default: null,
    type: String,
    example: new mongoose.Types.ObjectId(123),
    description: 'Уникальный идентификатор цели, за которой будет закреплена создаваемая операция.',
  })
  @IsString({
    message(arg) {
      if (arg.value && !mongoose.Types.ObjectId.isValid(arg.value)) {
        return OPERATION_MODEL_MESSAGES.TARGET_IS_INVALID;
      }
    },
  })
  @IsOptional()
  @IsEmpty()
  target?: string | null;

  @ApiProperty({
    name: 'category',
    required: false,
    nullable: true,
    default: null,
    type: [String],
    example: [new mongoose.Types.ObjectId(123), new mongoose.Types.ObjectId(321), 'Автомобиль'],
    description:
      'Массив идентификаторов категорий, за которыми будет закреплена создаваемая операция. Может содержать обычные строки с названием категорий, которых не существует.',
  })
  @IsArray({ message: OPERATION_MODEL_MESSAGES.CATEGORY_SHOULD_BE_ARRAY })
  @Type(() => String, {})
  @IsOptional()
  @ArrayMaxSize(OPERATION_MAX_CATEGORIES)
  category?: Array<string>;

  @ApiProperty({
    name: 'tags',
    required: false,
    nullable: true,
    default: null,
    type: [String],
    example: [
      new mongoose.Types.ObjectId(9090),
      new mongoose.Types.ObjectId(9192),
      'Моторное масло',
      'Тормозные колодки',
    ],
    description: `Массив идентификаторов тегов, за которыми будет закреплена создаваемая операция. Может содержать обычные строки с названием тегов, которых не существует.`,
  })
  @IsArray({ message: OPERATION_MODEL_MESSAGES.TAGS_SHOULD_BE_ARRAY })
  @Type(() => String)
  @IsOptional()
  @ArrayMaxSize(OPERATION_MAX_TAGS)
  tags?: Array<string>;
}
