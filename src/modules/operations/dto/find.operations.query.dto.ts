import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import mongoose from 'mongoose';
import { OPERATION_STATE, OPERATION_TYPES } from '../operations.constants';

export class FindOperationsQueryDto {
  @ApiProperty({
    name: 'fromDate',
    required: false,
    type: String,
    example: new Date().toISOString(),
    description: 'С какой даты включительно искать операции.',
  })
  @IsString({ message: '' })
  @IsOptional()
  fromDate?: string;

  @ApiProperty({
    name: 'toDate',
    type: String,
    required: false,
    example: new Date().toISOString(),
    description: 'По какую дату включительно искать операции.',
  })
  toDate?: string;

  @ApiProperty({
    name: 'title',
    type: String,
    required: false,
    example: 'Купить',
    description: 'Поиск по вхождению в название операции.',
  })
  title?: string;

  @ApiProperty({
    name: 'walletIds',
    type: [String],
    required: false,
    example: [new mongoose.Types.ObjectId(123).toString()],
    description: 'Искать по идентификатору кошелька.',
  })
  walletIds?: Array<string> | string;

  @ApiProperty({
    name: 'excludeWalletIds',
    type: [String],
    required: false,
    example: [new mongoose.Types.ObjectId(123).toString()],
    description: 'Исключить записи содержащие указанный идентификатор кошелька. Игнорируется, если указан walletIds.',
  })
  excludeWalletIds?: Array<string> | string;

  @ApiProperty({
    name: 'type',
    type: String,
    required: false,
    enum: Object.values(OPERATION_TYPES),
    example: OPERATION_TYPES.INCOME,
    description: 'Искать по типу операции: Доход/расход.',
  })
  type?: OPERATION_TYPES;

  @ApiProperty({
    name: 'minCost',
    type: String,
    required: false,
    example: 100,
    description: 'Минимальная стоимость операции',
  })
  minCost?: string;

  @ApiProperty({
    name: 'maxCost',
    type: String,
    required: false,
    example: 10_000,
    description: 'Максимальная стоимость операции',
  })
  maxCost?: string;

  @ApiProperty({
    name: 'cost',
    type: String,
    required: false,
    example: 10_000,
    description: 'Точная стоимость операции. Если указано, то minCost и maxCost - игнорируются.',
  })
  cost?: string;

  @ApiProperty({
    name: 'state',
    type: String,
    enum: Object.values(OPERATION_STATE),
    description: 'Состояние операции',
    example: OPERATION_STATE.REALISE,
    required: false,
  })
  state?: OPERATION_STATE;

  @ApiProperty({
    name: 'target',
    type: String,
    example: new mongoose.Types.ObjectId(123).toString(),
    description: 'Поиск по идентификатору цели',
    required: false,
  })
  target?: string;

  @ApiProperty({
    name: 'tags',
    type: [String],
    example: [new mongoose.Types.ObjectId(123).toString()],
    description: 'Поиск по идентификатору тегов',
    required: false,
  })
  tags?: Array<string> | string;

  @ApiProperty({
    name: 'categories',
    type: [String],
    example: [new mongoose.Types.ObjectId(123).toString()],
    description: 'Поиск по идентификаторам категорий',
    required: false,
  })
  categories?: Array<string> | string;
}
