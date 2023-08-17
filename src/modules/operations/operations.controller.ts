import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ResponseAdapter } from '../../utils/adapters/response.adapter';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import { TUserDocument } from '../profile/db_models/user.model';
import { UserInfo } from '../session/session.decorators';
import { SessionGuard } from '../session/session.guard';
import { ApiOperationResponseDto } from './dto/api.operation.response-dto';
import { CreateOperationDto } from './dto/create.operation.dto';
import { Operation } from './operations.model';
import { OperationsService } from './operations.service';

@ApiTags(SWAGGER_TAGS.OPERATIONS)
@Controller('operations')
export class OperationsController {
  constructor(private operationsService: OperationsService) {
  }
  
  @Get(':operationId')
  @ApiOperation({ summary: 'Получить операцию по ID' })
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  async getOperationById(@UserInfo() userInfo: TUserDocument) {
  }
  
  @Get()
  @ApiOperation({ summary: 'Получить список операций по фильтрам' })
  @HttpCode(HttpStatus.OK)
  getOperations() {
  }
  
  @Post()
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
    
    return new ResponseAdapter(result)
  }
  
  @Delete()
  @ApiOperation({ summary: 'Удалить операцию' })
  @HttpCode(HttpStatus.OK)
  removeOperation() {
  }
  
  @Patch()
  @ApiOperation({ summary: 'Обновить данные по операции' })
  @HttpCode(HttpStatus.OK)
  updateOperation() {
  }
}
