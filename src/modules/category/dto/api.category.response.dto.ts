import { ApiProperty } from '@nestjs/swagger';
import { API_INFO_SWAGGER_EXAMPLE } from "../../../utils/adapters/example";
import {
  ResponseAdapter,
  ResponseInfoAdapter,
} from '../../../utils/adapters/response.adapter';
import { Category } from '../category.model';

export class ApiCategoryResponseDto implements ResponseAdapter<Category> {
  @ApiProperty({
    name: 'data',
    type: Category,
    description: 'Здесь находятся данные',
    nullable: true,
    required: true,
  })
  data: Category;

  @ApiProperty(API_INFO_SWAGGER_EXAMPLE)
  info?: ResponseInfoAdapter;
}