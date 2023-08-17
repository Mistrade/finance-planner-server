import { ApiProperty } from '@nestjs/swagger';
import { API_INFO_SWAGGER_EXAMPLE } from '../../../utils/adapters/example';
import { ResponseAdapter, ResponseInfoAdapter } from '../../../utils/adapters/response.adapter';
import { Operation } from '../operations.model';

export class ApiOperationResponseDto implements ResponseAdapter<Operation> {
  @ApiProperty({
    name: 'data',
    example: Operation,
    type: Operation,
    description: 'Модель операции',
    default: Operation,
    required: true,
    nullable: false,
  })
  data: Operation;

  @ApiProperty(API_INFO_SWAGGER_EXAMPLE)
  info?: ResponseInfoAdapter;
}
