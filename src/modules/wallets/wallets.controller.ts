import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards, UsePipes, ValidationPipe
} from "@nestjs/common";
import {
  ApiCookieAuth, ApiCreatedResponse,
  ApiHeader,
  ApiOkResponse,
  ApiOperation,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import mongoose from 'mongoose';
import { ResponseAdapter } from '../../utils/adapters/response.adapter';
import { ExceptionFactory } from '../../utils/exception/exception.factory';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import {
  ApiHeaderTemplate,
  DEFAULT_SWAGGER_RESPONSE,
} from '../../utils/swagger/swagger.utils';
import { TUserDocument } from '../profile/db_models/user.model';
import { COOKIE_NAMES } from '../session/session.constants';
import { UserInfo } from '../session/session.decorators';
import { SessionGuard } from '../session/session.guard';
import { CreateWalletDto } from './dto/create.wallet.dto';
import {
  ApiArrayWalletsResponseDto,
  ApiWalletsResponseDto,
} from './dto/api.wallet.response-dto';
import { TWalletsExceptionCodes } from './wallets.exception';
import { TWalletDocument } from './wallets.model';
import { WalletsService } from './wallets.service';

@ApiTags(SWAGGER_TAGS.WALLETS)
@Controller('wallets')
export class WalletsController {
  constructor(
    private walletsService: WalletsService
  ) {}

  @Get('calculate')
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @UseGuards(SessionGuard)
  @ApiTags(SWAGGER_TAGS.CALCULATE)
  @ApiOperation({
    summary:
      'Принудительный пересчет всех кошельков, возвращает пересчитанный массив моделей кошельков',
  })
  @ApiOkResponse({
    type: [ApiArrayWalletsResponseDto],
    description: "Возвращает пересчитанный массив моделей",
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async walletCalculateData() {}

  @Get('calculate/:walletId')
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @UseGuards(SessionGuard)
  @ApiTags(SWAGGER_TAGS.CALCULATE)
  @ApiOperation({
    summary:
      'Принудительный пересчет данных по ID кошелька, возвращает пересчитанную модель кошелька',
  })
  @ApiOkResponse({
    type: ApiWalletsResponseDto,
    description: "Возвращает пересчитанный объект модели",
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async walletCalculateDataById() {}

  @Get(':walletId')
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Получить кошелек по ID' })
  @ApiOkResponse({
    type: ApiWalletsResponseDto,
    description: 'Полученная модель кошелька',
    status: HttpStatus.OK,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async getWalletById(
    @UserInfo() userInfo: TUserDocument,
    @Param('walletId') walletId: string,
  ): Promise<ApiWalletsResponseDto> {
    const walletObjectId = new mongoose.Types.ObjectId(walletId);
    const result = await this.walletsService.findOneById(
      userInfo._id,
      walletObjectId,
    );

    if (!result) {
      throw ExceptionFactory.create(
        { moduleName: 'wallets', code: 'NOT_FOUND' },
        null,
      );
    }

    return new ResponseAdapter(result);
  }

  @Get()
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Получить все кошельки' })
  @ApiOkResponse({
    type: ApiArrayWalletsResponseDto,
    description: 'Полученные модели',
    status: HttpStatus.OK,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async getWallets(
    @UserInfo() userInfo: TUserDocument,
  ): Promise<ApiArrayWalletsResponseDto> {
    const result: Array<TWalletDocument> =
      await this.walletsService.findManyByUserId(userInfo._id);

    if (result.length === 0) {
      throw ExceptionFactory.create(
        { moduleName: 'wallets', code: 'NOT_FOUND' },
        [],
      );
    }

    return new ResponseAdapter(result);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Создать кошелек' })
  @ApiCreatedResponse({
    type: ApiWalletsResponseDto,
    description: 'Созданная модель кошелька',
    status: HttpStatus.CREATED,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async createWallet(
    @Body() dto: CreateWalletDto,
    @UserInfo() userInfo: TUserDocument,
  ): Promise<ApiWalletsResponseDto> {
    const result: TWalletDocument | TWalletsExceptionCodes =
      await this.walletsService.createWallet(dto, userInfo);

    if (typeof result === 'string') {
      throw ExceptionFactory.create(
        { moduleName: 'wallets', code: result },
        null,
      );
    }

    return new ResponseAdapter<TWalletDocument>(result);
  }

  @Post('createBaseWallets')
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SessionGuard)
  @ApiOperation({
    summary:
      'Создает в базе данных стартовый набор кошельков, если какой-то из них отсутствует и возвращает массив базовых кошельков в полном объеме',
  })
  @ApiOkResponse({
    type: [ApiArrayWalletsResponseDto],
    description: 'Возвращает созданные документы',
    status: HttpStatus.CREATED,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async createBaseWallets(
    @UserInfo() userInfo: TUserDocument,
  ): Promise<ApiArrayWalletsResponseDto> {
    const result = await this.walletsService.createBaseWallets(userInfo._id);

    if (!result.length) {
      throw ExceptionFactory.create(
        { moduleName: 'wallets', code: 'CANT_CREATE_BASE_WALLETS' },
        [],
      );
    }

    return new ResponseAdapter<Array<TWalletDocument>>(result);
  }

  @Patch(':walletId')
  @UsePipes(new ValidationPipe())
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Обновить кошелек' })
  @ApiOkResponse({
    type: ApiWalletsResponseDto,
    description: 'Обновленная модель кошелька',
    status: HttpStatus.OK,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  updateWallet(
    @Body() dto: any,
    @Param('walletId') walletId: string,
    @UserInfo() userInfo: TUserDocument,
  ) {
    const walletObjectId = new mongoose.Types.ObjectId(walletId);
  }

  @Delete(':walletId')
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Удалить кошелек' })
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOkResponse({
    type: ApiWalletsResponseDto,
    description: 'Модель удаленного кошелька',
    status: HttpStatus.OK,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async removeWallet(
    @Param('walletId') walletId: string,
    @UserInfo() userInfo: TUserDocument,
  ): Promise<ApiWalletsResponseDto> {
    const walletObjectId = new mongoose.Types.ObjectId(walletId);
    const result: TWalletDocument | null =
      await this.walletsService.removeWalletById(walletObjectId, userInfo._id);

    if (!result) {
      throw ExceptionFactory.create(
        { moduleName: 'wallets', code: 'NOT_FOUND' },
        null,
      );
    }

    return new ResponseAdapter(result);
  }
}
