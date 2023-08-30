import { ApiProperty } from '@nestjs/swagger';
import { API_INFO_SWAGGER_EXAMPLE } from '../../../utils/adapters/example';
import { ResponseAdapter, ResponseInfoAdapter } from '../../../utils/adapters/response.adapter';
import { Operation } from '../operations.model';
import { OperationsSchema } from '../schema/operations.schema';

export interface ISchemaOperationsDates {
  [key: string]: Array<Operation>;
}

export interface ISchemaOperationsMonth {
  [key: string]: ISchemaOperationsDates;
}

export interface ISchemaOperationsMain {
  [key: string]: ISchemaOperationsMonth;
}

export class ApiSchemaOperationsDto implements ResponseAdapter<OperationsSchema> {
  @ApiProperty({
    name: 'data',
    required: true,
    type: OperationsSchema,
  })
  data: OperationsSchema;

  @ApiProperty(API_INFO_SWAGGER_EXAMPLE)
  info?: ResponseInfoAdapter;
}
