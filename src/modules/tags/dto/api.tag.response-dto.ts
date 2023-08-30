import { ApiProperty } from '@nestjs/swagger';
import { API_INFO_SWAGGER_EXAMPLE } from '../../../utils/adapters/example';
import { ResponseAdapter, ResponseInfoAdapter } from '../../../utils/adapters/response.adapter';
import { Tag } from '../tags.model';

export class ApiTagResponseDto implements ResponseAdapter<Tag> {
  @ApiProperty({
    name: 'data',
    type: Tag,
    description: 'Возвращаемая модель тега',
    required: true,
    nullable: true,
    default: Tag,
  })
  data: Tag;

  @ApiProperty(API_INFO_SWAGGER_EXAMPLE)
  info?: ResponseInfoAdapter;
}