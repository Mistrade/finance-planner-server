import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import dayjs from 'dayjs';
import { ISchemaOperationsMain } from '../dto/schema.operations.dto';
import { Operation } from '../operations.model';
import { OperationsSchemaCalculated } from './operations.schema.calculated';

// const TestOperation =

export class OperationsSchema {
  @ApiProperty({
    name: 'schema',
    description:
      'Здесь хранится сама схема. Пример получения данных из схемы: data[YYYY][MM][DD] - получим массив записей по "YYYY" году, "MM" месяцу в "DD" день.',
    nullable: true,
    required: true,
    properties: {
      '2023': {
        type: 'object',
        description: '2023 - год. Внутри года будут лежать месяца, для удобного извлечения данных.',
        properties: {
          '5': {
            description: 'Внутри года, лежит - месяц. Глубже будет лежать - день.',
            type: 'object',
            properties: {
              '22': {
                description: 'День. Он хранит в себе массив Operation объектов.',
                type: 'array',
                items: {
                  example: Operation,
                  $ref: getSchemaPath(Operation),
                //   TODO возвращается не полная Operation модель на самом деле
                },
              },
            },
          },
        },
      },
    },
  })
  schema: ISchemaOperationsMain;

  @ApiProperty({
    name: 'calculated',
    description: 'Аналитические данные по операциям, возвращенным в схеме',
    required: true,
    type: OperationsSchemaCalculated,
  })
  calculated: OperationsSchemaCalculated;

  constructor(arr: Array<Operation>) {
    this.schema = {};
    this.calculated = new OperationsSchemaCalculated();
    this.build(arr);
  }

  private build(arr: Array<Operation>) {
    for (let item of arr) {
      this.addToSchema(item);
      this.calculated.addOperation(item);
    }
  }

  private addToSchema(item: Operation) {
    const usageDate = dayjs(item.date);
    const year = usageDate.year();
    const month = usageDate.month();
    const date = usageDate.date();

    if (!this.schema[year]) {
      this.schema[year] = {};
    }

    if (!this.schema[year][month]) {
      this.schema[year][month] = {};
    }

    if (!this.schema[year][month][date]) {
      this.schema[year][month][date] = [];
    }

    this.schema[year][month][date].push(item);
  }

  addOperation(item: Operation) {
    this.build([item]);
  }
}
