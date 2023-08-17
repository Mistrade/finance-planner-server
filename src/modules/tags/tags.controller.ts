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
import {
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiHeader, ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags
} from "@nestjs/swagger";
import mongoose from 'mongoose';
import { ResponseAdapter } from '../../utils/adapters/response.adapter';
import { EXCEPTION_TYPES } from '../../utils/exception.data';
import { ExceptionFactory } from '../../utils/exception/exception.factory';
import { CustomResponse } from '../../utils/global.types';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import { ApiHeaderTemplate, DEFAULT_SWAGGER_RESPONSE } from '../../utils/swagger/swagger.utils';
import { ApiCategoryResponseDto } from "../category/dto/api.category.response.dto";
import { TUserDocument } from '../profile/db_models/user.model';
import { COOKIE_NAMES } from '../session/session.constants';
import { UserInfo } from '../session/session.decorators';
import { SessionGuard } from '../session/session.guard';
import { ApiArrayTagResponseDto } from "./dto/api.array-tag.response-dto";
import { ApiTagResponseDto } from './dto/api.tag.response-dto';
import { CreateTagDto } from './dto/create.tag.dto';
import { TAG_MESSAGES, TAG_TITLE_MAX_LENGTH, TAG_TITLE_MIN_LENGTH } from './tags.constants';
import { TTagDocument } from './tags.model';
import { TagsService, TagsServiceExceptionCodes } from './tags.service';

@ApiTags(SWAGGER_TAGS.TAGS)
@Controller('tags')
export class TagsController {
  constructor(private tagService: TagsService) {
  }
  
  @Get(':tagId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  @ApiParam({
    name: 'tagId',
    description: 'Идентификатор тега, который хотите получить',
    required: true,
  })
  @ApiOperation({ summary: 'Получить тег по ID' })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOkResponse({
    description: 'Запрос выполнен успешно, возвращается модель тега',
    type: ApiTagResponseDto,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async getTagById(@Param('tagId') tagId: string, @UserInfo() userInfo: TUserDocument): Promise<ApiTagResponseDto> {
    const tagObjectId = new mongoose.Types.ObjectId(tagId);
    const result: TTagDocument | null = await this.tagService.findTagById(tagObjectId, userInfo._id);
    
    if (!result) {
      throw ExceptionFactory.create({ moduleName: 'tags', code: 'NOT_FOUND' }, null);
    }
    
    return new ResponseAdapter(result);
  }
  
  @Get()
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить список всех тегов' })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOkResponse({
    description: 'Запрос выполнен успешно, возвращается массив моделей',
    type: ApiArrayTagResponseDto,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async getTags(@UserInfo() userInfo: TUserDocument): Promise<ApiArrayTagResponseDto> {
    const result: Array<TTagDocument> = await this.tagService.findTagsByUserId(userInfo._id);
    
    if (result.length === 0) {
      throw ExceptionFactory.create({ moduleName: 'tags', code: 'NOT_FOUND' }, []);
    }
    
    return new ResponseAdapter(result);
  }
  
  @Post()
  @UsePipes(new ValidationPipe())
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Создать тег' })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiCreatedResponse({
    description: 'Запрос выполнен успешно, возвращается модель тега',
    type: ApiTagResponseDto,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async createTag(
    @Body() dto: CreateTagDto,
    @UserInfo() userInfo: TUserDocument,
  ): Promise<ApiTagResponseDto> {
    const result: TTagDocument | null = await this.tagService.createTag(dto, userInfo.id);
    
    if (!result) {
      throw ExceptionFactory.create({ moduleName: 'tags', code: 'CANT_CREATE' }, null);
    }
    
    return new ResponseAdapter(result, {
      type: EXCEPTION_TYPES.SUCCESS,
      message: TAG_MESSAGES.SUCCESS_CREATED,
    });
  }
  
  @Patch(':tagId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  @UsePipes(new ValidationPipe())
  @ApiOperation({ summary: 'Обновить тег' })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOkResponse({
    description: 'Запрос выполнен успешно, возвращается обновленная модель тега',
    type: ApiTagResponseDto,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async updateTag(
    @Body() dto: CreateTagDto,
    @UserInfo() userInfo: TUserDocument,
    @Param('tagId') tagId: string,
  ): Promise<ApiTagResponseDto> {
    const tagObjectId = new mongoose.Types.ObjectId(tagId);
    const result: TTagDocument | TagsServiceExceptionCodes | null = await this.tagService.updateTagInfo(
      dto,
      userInfo._id,
      tagObjectId,
    );
    
    if (!result) {
      throw ExceptionFactory.create({ moduleName: 'tags', code: 'NOT_FOUND' }, null);
    }
    
    if (typeof result === 'string') {
      throw ExceptionFactory.create({ moduleName: 'tags', code: result }, null);
    }
    
    return new ResponseAdapter(result, {
      type: EXCEPTION_TYPES.SUCCESS,
      message: TAG_MESSAGES.SUCCESS_UPDATED,
    });
  }
  
  @Delete(':tagId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Удалить тег' })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOkResponse({
    description: 'Запрос выполнен успешно, возвращается удаленная модель тега',
    type: ApiTagResponseDto,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async removeTag(
    @Param('tagId') tagId: string,
    @UserInfo() userInfo: TUserDocument,
  ): Promise<ApiTagResponseDto> {
    const tagObjectId = new mongoose.Types.ObjectId(tagId);
    const result: TTagDocument | null = await this.tagService.removeTag(tagObjectId, userInfo._id);
    
    if (!result) {
      throw ExceptionFactory.create({ moduleName: 'tags', code: 'CANT_REMOVED' }, null);
    }
    
    return new ResponseAdapter(result, {
      type: EXCEPTION_TYPES.SUCCESS,
      message: TAG_MESSAGES.SUCCESS_REMOVED,
    });
  }
}
