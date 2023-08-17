import { ApiProperty } from '@nestjs/swagger';
import { API_INFO_SWAGGER_EXAMPLE } from '../../../utils/adapters/example';
import { ResponseAdapter, ResponseInfoAdapter } from '../../../utils/adapters/response.adapter';
import { Tag } from '../tags.model';

export class ApiArrayTagResponseDto implements ResponseAdapter<Array<Tag>> {
  @ApiProperty({
    name: 'data',
    required: true,
    nullable: true,
    description: 'Возвращаемый массив моделей',
    type: [Tag],
  })
  data: Array<Tag>;
  @ApiProperty(API_INFO_SWAGGER_EXAMPLE)
  info?: ResponseInfoAdapter;
}
