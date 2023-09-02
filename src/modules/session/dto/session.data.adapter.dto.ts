import { ApiProperty } from '@nestjs/swagger';
import { ResponseAdapter, ResponseInfoAdapter } from '../../../utils/adapters/response.adapter';
import { Timezone } from '../../meta/models/timezone.model';
import { Profile } from '../../profile/profile.model';
import { ISessionData } from '../utils/session.data';

export class SessionDataAdapterDto {
  @ApiProperty({
    name: 'profile',
    type: Profile,
    description: 'Профиль пользователя',
    required: true,
  })
  profile: Omit<Profile, 'passwordHash'>;
  
  @ApiProperty({
    name: 'timezone',
    type: Timezone,
    nullable: true,
    required: true,
    description: 'Установленная, в рамках сессии, информация о часовом поясе пользователя.',
  })
  timezone: Timezone | null;
  
  @ApiProperty({
    name: 'timezoneSelectedByUser',
    type: Boolean,
    required: true,
    description: 'Логический флаг, указывающий на принудительную установку часового пояса пользователем, если true.',
  })
  timezoneSelectedByUser: boolean;
  
  constructor(data: ISessionData) {
    this.profile = data.profile;
    this.timezone = data.timezone;
    this.timezoneSelectedByUser = data.timezoneSelectedByUser;
  }
}

export class SessionDataResponseDto implements ResponseAdapter<SessionDataAdapterDto> {
  @ApiProperty({nullable: true})
  data: SessionDataAdapterDto;
  @ApiProperty()
  info?: ResponseInfoAdapter;
}