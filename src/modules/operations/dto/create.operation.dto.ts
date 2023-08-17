import { ApiProperty } from '@nestjs/swagger';
import mongoose, { Types } from 'mongoose';
import { DEFAULT_REPEAT_OPERATION_COUNT_MAP, OPERATION_REPEAT_PATTERNS, OPERATION_STATE } from '../operations.model';

export class CreateOperationDto {
  @ApiProperty({
    name: 'title',
    description: 'Название операции',
    example: 'Купить хлеб',
    type: String,
    required: true,
  })
  title: string;
  
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
  state?: OPERATION_STATE;
  
  @ApiProperty({
    name: 'repeat',
    required: false,
    default: false,
    example: false,
    type: Boolean,
    description: 'Флаг, указывающий на повторяемость операции. По умолчанию - false.',
  })
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
  endRepeatDate?: String;
  
  @ApiProperty({
    name: 'target',
    required: false,
    nullable: true,
    default: null,
    type: String,
    example: new mongoose.Types.ObjectId(123),
    description: 'Уникальный идентификатор цели, за которой будет закреплена создаваемая операция.',
  })
  target?: Types.ObjectId | null;
  
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
  category?: Types.ObjectId | null;
  
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
  tags?: Array<Types.ObjectId>;
}
