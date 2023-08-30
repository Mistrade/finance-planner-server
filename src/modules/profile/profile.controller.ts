import { Controller, Get, HttpCode, HttpStatus, Patch, UseGuards } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import { COOKIE_NAMES } from '../session/session.constants';
import { SessionGuard } from '../session/session.guard';
import { TUserModel, User } from './db_models/user.model';

@ApiTags(SWAGGER_TAGS.PROFILE)
@Controller('profile')
@UseGuards(SessionGuard)
export class ProfileController {
  constructor(@InjectModel(User.name) private readonly userModel: TUserModel) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить информацию о пользователе' })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  async getProfile() {}

  @Patch()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновить данные профиля' })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  async updateProfile() {}
}