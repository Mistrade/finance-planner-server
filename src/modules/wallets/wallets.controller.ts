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
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCookieAuth, ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { ResponseAdapter } from '../../utils/adapters/response.adapter';
import { ExceptionFactory } from '../../utils/exception/exception.factory';
import { RejectException } from '../../utils/exception/reject.exception';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import { DEFAULT_SWAGGER_RESPONSE } from '../../utils/swagger/swagger.utils';
import { TUserDocument } from '../profile/db_models/user.model';
import { COOKIE_NAMES } from '../session/session.constants';
import { UserInfo } from '../session/session.decorators';
import { SessionGuard } from '../session/session.guard';
import { ApiArrayWalletsResponseDto, ApiWalletsResponseDto } from './dto/api.wallet.response-dto';
import { CreateWalletDto } from './dto/create.wallet.dto';
import { WalletCalculateService } from './services/wallet.calculate.service';
import { WalletsService } from './services/wallets.service';
import { TWalletsExceptionCodes } from './wallets.exception';
import { TWalletDocument } from './wallets.model';

@ApiTags(SWAGGER_TAGS.WALLETS)
@Controller('wallets')
@UseGuards(SessionGuard)
@ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
export class WalletsController {
  constructor(
    private readonly walletsService: WalletsService,
    private readonly walletCalculateService: WalletCalculateService,
  ) {}

  @Get(':walletId')
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
    const result = await this.walletsService.findOneById(userInfo._id, walletObjectId);

    if (result instanceof RejectException) {
      throw result;
    }

    return new ResponseAdapter(result);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все кошельки' })
  @ApiOkResponse({
    type: ApiArrayWalletsResponseDto,
    description: 'Полученные модели',
    status: HttpStatus.OK,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async getWallets(@UserInfo() userInfo: TUserDocument): Promise<ApiArrayWalletsResponseDto> {
    const result: Array<TWalletDocument> = await this.walletCalculateService.calculateWallets(userInfo._id);

    if (result.length === 0) {
      throw ExceptionFactory.create({ moduleName: 'wallets', code: 'NOT_FOUND' }, []);
    }

    return new ResponseAdapter(result);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.CREATED)
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
    const result: TWalletDocument | TWalletsExceptionCodes = await this.walletsService.createWallet(dto, userInfo);

    if (typeof result === 'string') {
      throw ExceptionFactory.create({ moduleName: 'wallets', code: result }, null);
    }

    return new ResponseAdapter<TWalletDocument>(result);
  }

  @Post('createBaseWallets')
  @HttpCode(HttpStatus.CREATED)
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
  async createBaseWallets(@UserInfo() userInfo: TUserDocument): Promise<ApiArrayWalletsResponseDto> {
    const result = await this.walletsService.createBaseWallets(userInfo._id);

    if (!result.length) {
      throw ExceptionFactory.create({ moduleName: 'wallets', code: 'CANT_CREATE_BASE_WALLETS' }, []);
    }

    return new ResponseAdapter<Array<TWalletDocument>>(result);
  }

  @ApiTags(SWAGGER_TAGS.TODO)
  @Patch(':walletId')
  @UsePipes(new ValidationPipe())
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Обновить кошелек' })
  @ApiOkResponse({
    type: ApiWalletsResponseDto,
    description: 'Обновленная модель кошелька',
    status: HttpStatus.OK,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  updateWallet(@Body() dto: any, @Param('walletId') walletId: string, @UserInfo() userInfo: TUserDocument) {
    // TODO
    const walletObjectId = new mongoose.Types.ObjectId(walletId);
  }

  @Delete(':walletId')
  @ApiOperation({ summary: 'Удалить кошелек' })
  @HttpCode(HttpStatus.OK)
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
    const result: TWalletDocument | null = await this.walletsService.removeWalletById(walletObjectId, userInfo._id);

    if (!result) {
      throw ExceptionFactory.create({ moduleName: 'wallets', code: 'NOT_FOUND' }, null);
    }

    return new ResponseAdapter(result);
  }
}
