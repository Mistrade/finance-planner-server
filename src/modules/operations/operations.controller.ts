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
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiBody, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { ResponseAdapter } from '../../utils/adapters/response.adapter';
import { ExceptionFactory } from '../../utils/exception/exception.factory';
import { RejectException } from '../../utils/exception/reject.exception';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import { TUserDocument, User } from '../profile/db_models/user.model';
import { UserInfo } from '../session/session.decorators';
import { SessionGuard } from '../session/session.guard';
import { ApiOperationResponseDto } from './dto/api.operation.response-dto';
import { CreateOperationDto } from './dto/create.operation.dto';
import { FindOperationsQueryDto } from './dto/find.operations.query.dto';
import { OperationFieldsDto, UpdateOperationDto } from './dto/operation.fields.dto';
import { ApiSchemaOperationsDto, ISchemaOperationsMain } from './dto/schema.operations.dto';
import { OPERATION_STATE, OPERATION_TYPES } from './operations.constants';
import { OperationsBuilderService } from './services/operations.builder.service';
import { OperationsFindService } from './services/operations.find.service';
import { OperationsService } from './services/operations.service';
import { OperationsUpdateService } from './services/operations.update.service';

@ApiTags(SWAGGER_TAGS.OPERATIONS)
@Controller('operations')
@UseGuards(SessionGuard)
export class OperationsController {
  constructor(
    private operationsService: OperationsService,
    private operationsFindService: OperationsFindService,
    private operationBuilderService: OperationsBuilderService,
    private updateService: OperationsUpdateService,
  ) {}

  @Get('schema')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Получить список операций в виде объекта по фильтрам' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Запрос выполнен успешно.',
    type: ApiSchemaOperationsDto,
  })
  async getOperationsSchema(
    @UserInfo() userInfo: User,
    @Query() query: FindOperationsQueryDto,
  ): Promise<ApiSchemaOperationsDto> {
    console.log(query);
    const result = await this.operationsFindService.findByFilters(query, userInfo);

    if (!result || !result?.length) {
      throw ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' }, {});
    }

    const schema: ISchemaOperationsMain = await this.operationBuilderService.buildSchema(result);

    return new ResponseAdapter(schema);
  }

  @Get(':operationId')
  @ApiOperation({ summary: 'Получить операцию по ID' })
  @HttpCode(HttpStatus.OK)
  async getOperationById(
    @Param('operationId') id: string,
    @UserInfo() userInfo: TUserDocument,
  ): Promise<ApiOperationResponseDto> {
    const result = await this.operationsFindService.findById(new mongoose.Types.ObjectId(id), userInfo._id);

    if (!result) {
      throw ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' }, null);
    }

    return new ResponseAdapter(result);
  }

  @Get()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Получить список операций по фильтрам' })
  @HttpCode(HttpStatus.OK)
  async getOperations(@UserInfo() userInfo: User, @Query() queryParams: FindOperationsQueryDto) {
    const result = await this.operationsFindService.findByFilters(queryParams, userInfo);

    if (!result.length || !result) {
      throw ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' }, []);
    }

    return new ResponseAdapter(result);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Создать операцию' })
  @HttpCode(HttpStatus.CREATED)
  @ApiOkResponse({
    description: 'Операция успешно создана, возвращается созданная модель операции',
    type: ApiOperationResponseDto,
  })
  async createOperation(
    @Body() dto: CreateOperationDto,
    @UserInfo() userInfo: TUserDocument,
  ): Promise<ApiOperationResponseDto> {
    const result = await this.operationsService.createOperation(dto, userInfo);

    return new ResponseAdapter(result);
  }

  @Post('many')
  @ApiOperation({ summary: '123' })
  async createMany(@UserInfo() user: User) {
    return this.operationsService.createMany(user);
  }

  @Delete(':operationId')
  @ApiOperation({ summary: 'Удалить операцию' })
  @HttpCode(HttpStatus.OK)
  async removeOperation(
    @Param('operationId') id: string,
    @UserInfo() userInfo: User,
  ): Promise<ApiOperationResponseDto> {
    const result = await this.operationsService.removeOperation(new mongoose.Types.ObjectId(id), userInfo._id);

    if (!result) {
      throw ExceptionFactory.create({ moduleName: 'operations', code: 'NOTHING_TO_REMOVE' }, null);
    }

    return new ResponseAdapter(result);
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
