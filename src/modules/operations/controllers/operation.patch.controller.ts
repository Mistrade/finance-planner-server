import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  UseGuards,
  UsePipes,
  ValidationPipe
} from "@nestjs/common";
import { ApiBody, ApiCookieAuth, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from "@nestjs/swagger";
import mongoose from "mongoose";
import { ResponseAdapter } from "../../../utils/adapters/response.adapter";
import { ExceptionFactory } from "../../../utils/exception/exception.factory";
import { RejectException } from "../../../utils/exception/reject.exception";
import { CONTROLLER_PATHS } from "../../../utils/global.constants";
import { SWAGGER_TAGS } from "../../../utils/swagger/swagger.constants";
import { User } from "../../profile/db_models/user.model";
import { COOKIE_NAMES } from "../../session/session.constants";
import { UserInfo } from "../../session/session.decorators";
import { SessionGuard } from "../../session/session.guard";
import { ApiOperationResponseDto } from "../dto/api.operation.response-dto";
import { OperationFieldsDto, UpdateOperationDto } from "../dto/operation.fields.dto";
import { OPERATION_STATE, OPERATION_TYPES } from "../operations.constants";
import { OperationsUpdateService } from "../services/operations.update.service";

@ApiTags(SWAGGER_TAGS.OPERATIONS)
@Controller(CONTROLLER_PATHS.OPERATIONS)
@UseGuards(SessionGuard)
@ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
export class OperationPatchController {
  constructor(
    private readonly updateService: OperationsUpdateService,
  ) {
  }
  
  
  @Patch(':operationId/:operationFieldName')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Обновить данные по операции' })
  @HttpCode(HttpStatus.OK)
  @ApiParam({
    name: 'operationFieldName',
    type: String,
    description: 'Ключ, который необходимо обновить в карточке операции.',
    enum: Object.keys(OperationFieldsDto),
  })
  @ApiParam({
    name: 'operationId',
    type: String,
    description: 'Идентификатор операции, которую нужно обновить',
    example: new mongoose.Types.ObjectId(123),
  })
  @ApiBody({
    description:
      'В теле запроса нужно передать объект, в котором будет содержаться ключ, указанный в operationFieldName параметре пути, с указанным в схеме значением. Обновляется только то поле, которое было указано в path parameters.',
    required: true,
    type: UpdateOperationDto,
    examples: {
      title: {
        value: {
          title: 'Новое название операции',
        },
        summary: 'Название операции',
      },
      cost: {
        value: {
          cost: 100500,
        },
        summary: 'Стоимость операции',
      },
      description: {
        value: {
          description: 'Новое описание события',
        },
        summary: 'Подробное описание операции',
      },
      date: {
        value: {
          date: new Date().toISOString(),
        },
        summary: 'Дата операции',
      },
      state: {
        value: {
          state: OPERATION_STATE.REALISE,
        },
        summary: `Состояние операции. state.`,
      },
      type: {
        value: {
          type: OPERATION_TYPES.CONSUMPTION,
        },
        summary: 'Тип операции',
      },
      category: {
        value: {
          category: [new mongoose.Types.ObjectId(9090)],
        },
        summary: 'Список категорий',
      },
      tags: {
        value: {
          tags: [new mongoose.Types.ObjectId(9091)],
        },
        summary: 'Список тегов',
      },
    },
  })
  @ApiOkResponse({
    type: ApiOperationResponseDto,
    description: 'Если обновление выполнено успешно, вернется обновленная модель операции.',
  })
  async updateOperation(
    @Param('operationId') id: string,
    @Param('operationFieldName') field: keyof UpdateOperationDto,
    @UserInfo() user: User,
    @Body() dto: UpdateOperationDto,
  ) {
    const result = await this.updateService.updateOneById(new mongoose.Types.ObjectId(id), field, dto, user);
    
    if (result instanceof RejectException) {
      throw result;
    }
    
    if (!result) {
      throw ExceptionFactory.createDefault(null);
    }
    
    return new ResponseAdapter(result);
  }
}