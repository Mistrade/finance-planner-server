import { ApiProperty } from '@nestjs/swagger';
import { Type } from "class-transformer";
import {
  ArrayMaxSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
  MinLength
} from "class-validator";
import mongoose from 'mongoose';
import {
  OPERATION_DESCRIPTION_MAX_LENGTH, OPERATION_MAX_CATEGORIES, OPERATION_MAX_TAGS,
  OPERATION_MODEL_MESSAGES,
  OPERATION_STATE, OPERATION_TITLE_MAX_LENGTH, OPERATION_TITLE_MIN_LENGTH,
  OPERATION_TYPES
} from "../operations.constants";
import { Operation } from '../operations.model';

type DtoFields = keyof Omit<
  Operation,
  | 'user'
  | 'wallet'
  | 'repeat'
  | 'repeatPattern'
  | 'endRepeatDate'
  | 'repeatSource'
  | 'target'
  | '_id'
  | 'createdAt'
  | 'updatedAt'
>;

type ImplementSource = {
  [key in DtoFields]: any;
};

export const OperationFieldsDto: ImplementSource = {
  category: [],
  tags: [],
  type: OPERATION_TYPES.INCOME,
  state: OPERATION_STATE.REALISE,
  title: '123',
  description: '123',
  cost: 100,
  date: new Date().toISOString(),
};

export class UpdateOperationDto implements Partial<ImplementSource> {
  @ApiProperty({
    name: 'title',
    required: false,
    description:
      'Если нужно обновить заголовок операции - поле обязательно. В карточку операции будет установлено новое значение, если оно валидно.',
    type: String,
    nullable: false,
    example: 'Новое название операции',
  })
  @IsOptional()
  @IsString({message: OPERATION_MODEL_MESSAGES.TITLE_SHOULD_BE_STRING})
  @MinLength(OPERATION_TITLE_MIN_LENGTH, {message: OPERATION_MODEL_MESSAGES.TITLE_MIN_LENGTH})
  @MaxLength(OPERATION_TITLE_MAX_LENGTH, {message: OPERATION_MODEL_MESSAGES.TITLE_MAX_LENGTH})
  title?: string;

  @ApiProperty({
    name: 'description',
    required: false,
    description:
      'Если нужно обновить описание операции - поле обязательно. В карточку операции будет установлено новое значение, если оно валидно.',
    type: String,
    nullable: false,
    example: 'Новое Описание операции',
    maxLength: OPERATION_DESCRIPTION_MAX_LENGTH,
  })
  @IsOptional()
  @IsString({message: OPERATION_MODEL_MESSAGES.DESCRIPTION_SHOULD_BE_STRING})
  @MaxLength(OPERATION_DESCRIPTION_MAX_LENGTH, {message: OPERATION_MODEL_MESSAGES.DESCRIPTION_MAX_LENGTH})
  description?: string;

  @ApiProperty({
    name: 'date',
    required: false,
    type: String,
    description:
      'Если нужно обновить дату операции - поле обязательно. В карточку операции будет установлено новое значение, если оно валидно.',
    nullable: false,
    example: new Date().toISOString(),
  })
  @IsOptional()
  @IsDateString({strict: false}, {message: OPERATION_MODEL_MESSAGES.DATE_IS_INVALID})
  date?: string;

  @ApiProperty({
    name: 'cost',
    required: false,
    description:
      'Если нужно обновить стоимость операции - поле обязательно. В карточку операции будет установлено новое значение, если оно валидно.',
    type: Number,
    nullable: false,
    example: 100500,
  })
  @IsOptional()
  @IsNumber({allowNaN: false, allowInfinity: false}, {message: OPERATION_MODEL_MESSAGES.COST_SHOULD_BE_NUMBER})
  cost?: number;

  @ApiProperty({
    name: 'type',
    enum: Object.values(OPERATION_TYPES),
    description:
      'Если нужно обновить тип операции - поле обязательно. В карточку операции будет установлено новое значение, если оно валидно.',
    type: String,
    nullable: false,
    required: false,
    example: OPERATION_TYPES.CONSUMPTION,
  })
  @IsOptional()
  @IsEnum(Object.values(OPERATION_TYPES), {message: OPERATION_MODEL_MESSAGES.OPERATION_TYPE_SHOULD_BE_ENUM})
  type?: OPERATION_TYPES;

  @ApiProperty({
    name: 'state',
    enum: Object.values(OPERATION_STATE),
    description:
      'Если нужно обновить состояние операции - поле обязательно. В карточку операции будет установлено новое значение, если оно валидно.',
    required: false,
    nullable: false,
    type: String,
    example: OPERATION_STATE.REALISE,
  })
  @IsOptional()
  @IsEnum(Object.values(OPERATION_STATE), {message: OPERATION_MODEL_MESSAGES.STATE_SHOULD_BE_ENUM})
  state?: OPERATION_STATE;

  @ApiProperty({
    name: 'category',
    required: false,
    nullable: false,
    default: [],
    type: [String],
    example: [new mongoose.Types.ObjectId(123)],
    description:
      'Если нужно обновить список категорий операции - поле обязательно. Входное значение - массив идентификаторов категорий. В карточку операции будет установлено новое значение (новый массив), если оно валидно.',
  })
  @IsOptional()
  @IsArray({message: OPERATION_MODEL_MESSAGES.CATEGORY_SHOULD_BE_ARRAY})
  @ArrayMaxSize(OPERATION_MAX_CATEGORIES, {message: OPERATION_MODEL_MESSAGES.CATEGORY_MAX_LENGTH})
  @Type(() => String, {})
  category?: Array<string>;

  @ApiProperty({
    name: 'tags',
    required: false,
    nullable: false,
    default: [],
    type: [String],
    example: [new mongoose.Types.ObjectId(123)],
    description:
      'Если нужно обновить список тегов операции - поле обязательно. Входное значение - массив идентификаторов тегов. В карточку операции будет установлено новое значение (новый массив), если оно валидно.',
  })
  @IsOptional()
  @IsArray({message: OPERATION_MODEL_MESSAGES.TAGS_SHOULD_BE_ARRAY})
  @ArrayMaxSize(OPERATION_MAX_TAGS, {message: OPERATION_MODEL_MESSAGES.TAGS_MAX_LENGTH})
  @Type(() => String, {})
  tags?: Array<string>;
}
