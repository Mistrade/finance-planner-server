import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { API_INFO_SWAGGER_EXAMPLE } from '../../../utils/adapters/example';
import { ResponseAdapter, ResponseInfoAdapter } from '../../../utils/adapters/response.adapter';
import { Operation } from '../operations.model';

export interface ISchemaOperationsDates {
  [key: string]: Array<Operation>;
}

export interface ISchemaOperationsMonth {
  [key: string]: ISchemaOperationsDates;
}

export interface ISchemaOperationsMain {
  [key: string]: ISchemaOperationsMonth;
}

export class ApiSchemaOperationsDto implements ResponseAdapter<ISchemaOperationsMain> {
  @ApiProperty({
    name: 'data',
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
                },
              },
            },
          },
        },
      },
    },
  })
  data: ISchemaOperationsMain;

  @ApiProperty(API_INFO_SWAGGER_EXAMPLE)
  info?: ResponseInfoAdapter;
}
