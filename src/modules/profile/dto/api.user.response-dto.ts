import { ApiProperty } from '@nestjs/swagger';
import { API_INFO_SWAGGER_EXAMPLE } from '../../../utils/adapters/example';
import { ResponseAdapter, ResponseInfoAdapter } from '../../../utils/adapters/response.adapter';
import { Profile } from '../profile.model';

export class ApiUserResponseDto implements ResponseAdapter<Profile> {
  @ApiProperty({
    name: 'data',
    nullable: true,
    required: true,
    type: Profile,
    description: 'Данные пользователя',
    example: Profile,
  })
  data: Profile;

  @ApiProperty(API_INFO_SWAGGER_EXAMPLE)
  info?: ResponseInfoAdapter;
}