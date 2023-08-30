import { Controller, Delete, HttpCode, HttpStatus, Param, UseGuards } from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { ResponseAdapter } from '../../../utils/adapters/response.adapter';
import { EXCEPTION_TYPES } from '../../../utils/exception.data';
import { RejectException } from '../../../utils/exception/reject.exception';
import { CONTROLLER_PATHS } from "../../../utils/global.constants";
import { SWAGGER_TAGS } from '../../../utils/swagger/swagger.constants';
import { DEFAULT_SWAGGER_RESPONSE } from '../../../utils/swagger/swagger.utils';
import { User } from '../../profile/db_models/user.model';
import { COOKIE_NAMES } from '../../session/session.constants';
import { UserInfo } from '../../session/session.decorators';
import { SessionGuard } from '../../session/session.guard';
import { WalletCalculateService } from '../../wallets/services/wallet.calculate.service';
import { ApiOperationResponseDto } from '../dto/api.operation.response-dto';
import { OPERATION_API_MESSAGES } from '../operations.constants';
import { OperationRemoveService } from '../services/operation.remove.service';

@ApiTags(SWAGGER_TAGS.OPERATIONS)
@Controller(CONTROLLER_PATHS.OPERATIONS)
@UseGuards(SessionGuard)
@ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
export class OperationDeleteController {
  constructor(
    private readonly removeService: OperationRemoveService,
    // private readonly walletCalculateService: WalletCalculateService,
  ) {}

  @Delete('byWalletId/:walletId')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOperation({ summary: 'Удаление всех операций по идентификатору кошелька, за которым операции были закреплены.' })
  @ApiParam({ name: 'walletId', description: 'Идентификатор кошелька, операции которого будут удалены.' })
  @ApiOkResponse({ type: ResponseAdapter, description: 'Удаление выполнено успешно' })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async removeByWalletId(@Param('walletId') walletId: string, @UserInfo() user: User) {
    const result = await this.removeService.removeAllByWalletId(new mongoose.Types.ObjectId(walletId), user._id);

    if (result instanceof RejectException) {
      throw result;
    }

    return new ResponseAdapter(null, {
      type: EXCEPTION_TYPES.SUCCESS,
      message: OPERATION_API_MESSAGES.SUCCESS_REMOVED,
    });
  }

  @Delete(':operationId')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiParam({ name: 'operationId', description: 'Идентификатор операции, которая будет удалена.' })
  @ApiOperation({ summary: 'Удаление операции по ее идентификатору' })
  @ApiOkResponse({
    type: ApiOperationResponseDto,
    description: 'Удаление операции выполнено успешно. Возвращается удаленная операция.',
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async removeById(@Param('operationId') id: string, @UserInfo() user: User): Promise<ApiOperationResponseDto> {
    const result = await this.removeService.removeById(new mongoose.Types.ObjectId(id), user._id);

    if (result instanceof RejectException) {
      throw result;
    }

    return new ResponseAdapter(result, {
      type: EXCEPTION_TYPES.SUCCESS,
      message: OPERATION_API_MESSAGES.SUCCESS_REMOVED,
    });
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOperation({ summary: 'Удаление всех операций пользователя' })
  @ApiOkResponse({ type: ResponseAdapter, description: 'Удаление всех операций выполнено успешно.' })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async removeAll(@UserInfo() user: User): Promise<ResponseAdapter> {
    const result = await this.removeService.removeAllByUserId(user._id);

    if (result instanceof RejectException) {
      throw result;
    }

    return new ResponseAdapter(null, {
      type: EXCEPTION_TYPES.SUCCESS,
      message: OPERATION_API_MESSAGES.SUCCESS_REMOVED,
    });
  }
}
