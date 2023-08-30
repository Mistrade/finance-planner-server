import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards, UsePipes, ValidationPipe } from "@nestjs/common";
import { ApiCookieAuth, ApiOkResponse, ApiOperation, ApiTags } from "@nestjs/swagger";
import { ResponseAdapter } from "../../../utils/adapters/response.adapter";
import { CONTROLLER_PATHS } from "../../../utils/global.constants";
import { SWAGGER_TAGS } from "../../../utils/swagger/swagger.constants";
import { TUserDocument, User } from "../../profile/db_models/user.model";
import { COOKIE_NAMES } from "../../session/session.constants";
import { UserInfo } from "../../session/session.decorators";
import { SessionGuard } from "../../session/session.guard";
import { ApiOperationResponseDto } from "../dto/api.operation.response-dto";
import { CreateOperationDto } from "../dto/create.operation.dto";
import { OperationsCreateService } from "../services/operations.create.service";

@ApiTags(SWAGGER_TAGS.OPERATIONS)
@Controller(CONTROLLER_PATHS.OPERATIONS)
@UseGuards(SessionGuard)
@ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
export class OperationPostController {
  constructor(
    private readonly operationsCreateService: OperationsCreateService
  ) {
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
    const result = await this.operationsCreateService.createOperation(dto, userInfo);
    
    return new ResponseAdapter(result);
  }
  
  @Post('many')
  @ApiOperation({ summary: '123' })
  async createMany(@UserInfo() user: User) {
    return this.operationsCreateService.createMany(user);
  }
}