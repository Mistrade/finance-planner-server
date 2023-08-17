import { Body, Controller, HttpCode, HttpStatus, Post, Res, UsePipes, ValidationPipe } from '@nestjs/common';
import { ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { ResponseAdapter } from '../../utils/adapters/response.adapter';
import { EXCEPTION_TYPES } from '../../utils/exception.data';
import { ExceptionFactory } from '../../utils/exception/exception.factory';
import { AnyModuleExceptionObject } from '../../utils/exception/types';
import { CustomResponse } from '../../utils/global.types';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import { DEFAULT_SWAGGER_RESPONSE } from '../../utils/swagger/swagger.utils';
import { TUserDocument, User } from '../profile/db_models/user.model';
import { ApiUserResponseDto } from '../profile/dto/api.user.response-dto';
import { TProfileExceptionCodes } from '../profile/profile.exception';
import { WalletsService } from '../wallets/wallets.service';
import { SessionDto } from './dto/session.dto';
import { COOKIE_NAMES, SESSION_MESSAGES } from './session.constants';
import { GetCookies } from './session.decorators';
import { SessionService } from './session.service';
import { SignInServiceMethodReturned } from './types/session.types';

@ApiTags(SWAGGER_TAGS.SESSION)
@Controller('session')
export class SessionController {
  constructor(private readonly sessionService: SessionService, private readonly walletService: WalletsService) {
  }
  
  @UsePipes(new ValidationPipe())
  @Post('signUp')
  @ApiOperation({ summary: 'Регистрация пользователя' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: ApiUserResponseDto,
    description: 'Регистрация прошла успешно, возвращаются данные о созданном пользователе',
    status: HttpStatus.OK,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async register(@Body() dto: SessionDto): Promise<ApiUserResponseDto> {
    const result: TUserDocument | TProfileExceptionCodes = await this.sessionService.registerUser(dto);
    
    if (typeof result === 'string') {
      throw ExceptionFactory.create({ moduleName: 'profile', code: result }, null);
    }
    
    const wallets = await this.walletService.createBaseWallets(result._id);
    
    if (!wallets.length) {
      throw ExceptionFactory.create({ moduleName: 'session', code: 'REG_CANT_CREATE_BASE_WALLETS' }, null);
    }
    
    return new ResponseAdapter(result, {
      type: EXCEPTION_TYPES.SUCCESS,
      message: SESSION_MESSAGES.USER_SUCCESSFULLY_CREATED,
    });
  }
  
  @UsePipes(new ValidationPipe())
  @Post('signIn')
  @ApiOperation({ summary: 'Авторизация пользователя' })
  @HttpCode(HttpStatus.OK)
  @ApiCreatedResponse({
    type: ApiUserResponseDto,
    description: 'Авторизация прошла успешно, возвращаются данные об авторизованном пользователе',
    status: HttpStatus.OK,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async login(
    @Body() dto: SessionDto,
    @GetCookies(COOKIE_NAMES.ACCESS_TOKEN) token: string | null,
    @Res() res: Response<CustomResponse<User>>,
  ): Promise<Response<ApiUserResponseDto>> {
    const data: SignInServiceMethodReturned | AnyModuleExceptionObject | null = await this.sessionService.signInUser(
      dto,
      token,
    );
    
    if ('moduleName' in data && 'code' in data) {
      throw ExceptionFactory.create(data, null);
    }
    
    this.sessionService.setSessionTokenToResponse(data.token, res);
    
    const result: ApiUserResponseDto = new ResponseAdapter(data.userInfo, {
      type: EXCEPTION_TYPES.SUCCESS,
      message: SESSION_MESSAGES.USER_SUCCESS_LOGIN,
    });
    
    return res.status(HttpStatus.OK).json(result);
  }
  
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOperation({ summary: 'Завершение сессии' })
  @ApiOkResponse({
    ...DEFAULT_SWAGGER_RESPONSE,
    description: 'Если сессия успешно завершена, вернется статус 200',
    status: HttpStatus.OK,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async logout(@GetCookies() token: string | null, @Res() res: Response<CustomResponse<null>>) {
    this.sessionService.removeTokenFromCookie(res);
  }
}
