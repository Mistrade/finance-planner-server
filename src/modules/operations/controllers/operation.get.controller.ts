import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Query,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import mongoose from 'mongoose';
import { ResponseAdapter } from '../../../utils/adapters/response.adapter';
import { ExceptionFactory } from '../../../utils/exception/exception.factory';
import { CONTROLLER_PATHS } from '../../../utils/global.constants';
import { SWAGGER_TAGS } from '../../../utils/swagger/swagger.constants';
import { TProfileDocument, Profile } from '../../profile/profile.model';
import { COOKIE_NAMES } from '../../session/session.constants';
import { UserInfo } from '../../session/session.decorators';
import { SessionGuard } from '../../session/session.guard';
import { ApiOperationResponseDto } from '../dto/api.operation.response-dto';
import { FindOperationsQueryDto } from '../dto/find.operations.query.dto';
import { ApiSchemaOperationsDto } from '../dto/schema.operations.dto';
import { Operation } from '../operations.model';
import { OperationsSchema } from '../schema/operations.schema';
import { OperationsBuilderService } from '../services/operations.builder.service';
import { OperationsFindService } from '../services/operations.find.service';

@ApiTags(SWAGGER_TAGS.OPERATIONS)
@Controller(CONTROLLER_PATHS.OPERATIONS)
@UseGuards(SessionGuard)
@ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
export class OperationGetController {
  constructor(
    private readonly operationsFindService: OperationsFindService,
    private readonly operationBuilderService: OperationsBuilderService,
  ) {
  }
  
  @Get('schema')
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Получить список операций в виде объекта по фильтрам' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Запрос выполнен успешно.',
    type: ApiSchemaOperationsDto,
  })
  async getOperationsSchema(
    @UserInfo() userInfo: Profile,
    @Query() query: FindOperationsQueryDto,
  ): Promise<ApiSchemaOperationsDto> {
    const result: Array<Operation> = await this.operationsFindService.findByFilters(query, userInfo, {
      lean: true,
      projection: { repeat: 0, repeatSource: 0, repeatPattern: 0, endRepeatDate: 0, __v: 0, updatedAt: 0, user: 0 },
    });
    
    if (!result || !result?.length) {
      throw ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' }, {});
    }
    
    const schema = new OperationsSchema(result);
    
    return new ResponseAdapter(schema);
  }
  
  @Get(':operationId')
  @ApiOperation({ summary: 'Получить операцию по ID' })
  @HttpCode(HttpStatus.OK)
  async getOperationById(
    @Param('operationId') id: string,
    @UserInfo() userInfo: TProfileDocument,
  ): Promise<ApiOperationResponseDto> {
    const result = await this.operationsFindService.findById(new mongoose.Types.ObjectId(id), userInfo._id, {
      lean: true,
    });
    
    if (!result) {
      throw ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' }, null);
    }
    
    return new ResponseAdapter(result);
  }
  
  @Get()
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Получить список операций по фильтрам' })
  @HttpCode(HttpStatus.OK)
  async getOperations(@UserInfo() userInfo: Profile, @Query() queryParams: FindOperationsQueryDto) {
    const result = await this.operationsFindService.findByFilters(queryParams, userInfo, {
      lean: true,
      projection: { repeat: 0, repeatSource: 0, repeatPattern: 0, endRepeatDate: 0 },
    });
    
    if (!result.length || !result) {
      throw ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' }, []);
    }
    
    return new ResponseAdapter(result);
  }
}