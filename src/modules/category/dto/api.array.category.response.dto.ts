import { ApiProperty } from '@nestjs/swagger';
import { API_INFO_SWAGGER_EXAMPLE } from '../../../utils/adapters/example';
import { ResponseAdapter, ResponseInfoAdapter } from '../../../utils/adapters/response.adapter';
import { Category } from '../category.model';

export class ApiArrayCategoryResponseDto implements ResponseAdapter<Array<Category>> {
  @ApiProperty({
    name: 'data',
    type: [Category],
    description: 'Массив моделей категории',
    required: true,
    nullable: true,
  })
  data: Array<Category>;

  @ApiProperty(API_INFO_SWAGGER_EXAMPLE)
  info?: ResponseInfoAdapter;
}
