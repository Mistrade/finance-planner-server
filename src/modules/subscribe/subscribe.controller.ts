import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiHeader, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import { ApiHeaderTemplate } from '../../utils/swagger/swagger.utils';
import { TUserDocument } from '../profile/db_models/user.model';
import { UserInfo } from '../session/session.decorators';
import { SessionGuard } from '../session/session.guard';
import { SubscribeService } from './subscribe.service';

@ApiTags(SWAGGER_TAGS.SUBSCRIBE)
@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly subscribeService: SubscribeService) {}

  @Get()
  @UseGuards(SessionGuard)
  @ApiHeader(ApiHeaderTemplate)
  @ApiOperation({ summary: 'Возвращает объект текущей подписки пользователя' })
  getMySubscribe(@UserInfo() userInfo: TUserDocument) {
    return 'У тебя нет подписки';
  }
}
