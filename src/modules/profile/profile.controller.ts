import { Controller, Get, HttpCode, HttpStatus, Patch, Req, UseGuards } from "@nestjs/common";
import { InjectModel } from '@nestjs/mongoose';
import { ApiCookieAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import { COOKIE_NAMES } from '../session/session.constants';
import { AuthRequest, SessionGuard } from "../session/session.guard";
import { TProfileModel, Profile } from './profile.model';
import { ProfileService } from "./profile.service";

@ApiTags(SWAGGER_TAGS.PROFILE)
@Controller('profile')
@UseGuards(SessionGuard)
export class ProfileController {
  constructor(
    @InjectModel(Profile.name) private readonly userModel: TProfileModel,
    private readonly profileService: ProfileService,
  ) {}

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
  
  @Get('test')
  @ApiOperation({summary: "test"})
  @UseGuards(SessionGuard)
  async test(){
    // return this.profileService.testIp();
  }
}