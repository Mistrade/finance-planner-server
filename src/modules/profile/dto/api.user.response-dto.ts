import { ApiProperty } from '@nestjs/swagger';
import { API_INFO_SWAGGER_EXAMPLE } from '../../../utils/adapters/example';
import { ResponseAdapter, ResponseInfoAdapter } from '../../../utils/adapters/response.adapter';
import { User } from '../db_models/user.model';

export class ApiUserResponseDto implements ResponseAdapter<User> {
  @ApiProperty({
    name: 'data',
    nullable: true,
    required: true,
    type: User,
    description: 'Данные пользователя',
    example: User,
  })
  data: User;

  @ApiProperty(API_INFO_SWAGGER_EXAMPLE)
  info?: ResponseInfoAdapter;
}