import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Patch, Post, UseGuards } from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import mongoose from 'mongoose';
import { ResponseAdapter } from '../../utils/adapters/response.adapter';
import { EXCEPTION_TYPES } from '../../utils/exception.data';
import { ExceptionFactory } from '../../utils/exception/exception.factory';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import { DEFAULT_SWAGGER_RESPONSE } from '../../utils/swagger/swagger.utils';
import { TUserDocument } from '../profile/db_models/user.model';
import { COOKIE_NAMES } from '../session/session.constants';
import { UserInfo } from '../session/session.decorators';
import { SessionGuard } from '../session/session.guard';
import { CATEGORY_MESSAGES } from './category.constants';
import { TCategoryDocument } from './category.model';
import { CategoryService } from './category.service';
import { ApiArrayCategoryResponseDto } from './dto/api.array.category.response.dto';
import { ApiCategoryResponseDto } from './dto/api.category.response.dto';
import { CreateCategoryDto } from './dto/create.category.dto';

@ApiTags(SWAGGER_TAGS.CATEGORIES)
@Controller('categories')
export class CategoryController {
  constructor(private categoryService: CategoryService) {}

  @Get(':categoryId')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить данные по ID категории операций' })
  @ApiParam({
    name: 'categoryId',
    description: 'Идентификатор категории, содержится в _id ключе модели категории',
    type: String,
  })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOkResponse({
    description: 'Запрос выполнен успешно, возвращается модель категории',
    type: ApiCategoryResponseDto,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async getCategoryById(
    @Param('categoryId') categoryId: string,
    @UserInfo() userInfo: TUserDocument,
  ): Promise<ApiCategoryResponseDto> {
    const objectId = new mongoose.Types.ObjectId(categoryId);
    const category: TCategoryDocument | null = await this.categoryService.findCategoryById(objectId, userInfo._id);

    if (!category) {
      throw ExceptionFactory.create({ moduleName: 'categories', code: 'NOT_FOUND_BY_ID' }, null);
    }

    return new ResponseAdapter(category);
  }

  @Get()
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Получить все категории операций у пользователя' })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOkResponse({
    description: 'Запрос выполнен успешно, возвращается массив моделей категории',
    type: ApiArrayCategoryResponseDto,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async getCategories(@UserInfo() userInfo: TUserDocument): Promise<ApiArrayCategoryResponseDto> {
    const result = await this.categoryService.getAllCategoriesByUserId(userInfo._id);

    if (!result || !result.length) {
      throw ExceptionFactory.create({ moduleName: 'categories', code: 'NOT_FOUND_LIST' }, []);
    }

    return new ResponseAdapter(result);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(SessionGuard)
  @ApiOperation({ summary: 'Создать новую категорию операций' })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiCreatedResponse({
    description: 'Запрос выполнен успешно, возвращается модель категории',
    type: ApiCategoryResponseDto,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async createCategory(@Body() dto: CreateCategoryDto, @UserInfo() userInfo: TUserDocument) {
    const result = await this.categoryService.createCategory(dto, userInfo);

    if (!result) {
      throw ExceptionFactory.create({ moduleName: 'categories', code: 'CATEGORY_ALREADY_EXISTS' }, null);
    }

    return new ResponseAdapter(result, {
      type: EXCEPTION_TYPES.SUCCESS,
      message: CATEGORY_MESSAGES.SUCCESS_CREATED,
    });
  }

  @Patch(':categoryId')
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  @ApiBody({
    type: CreateCategoryDto,
    description: 'Входные параметры запроса',
    required: true,
  })
  @ApiOperation({ summary: 'Обновить данные категории операций' })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOkResponse({
    description: 'Запрос выполнен успешно, возвращается модель категории',
    type: ApiCategoryResponseDto,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async updateCategoryById(
    @Body() dto: CreateCategoryDto,
    @Param('categoryId') categoryId: string,
    @UserInfo() userInfo: TUserDocument,
  ): Promise<ApiCategoryResponseDto> {
    const result: TCategoryDocument | null = await this.categoryService.updateCategoryData(
      dto,
      new mongoose.Types.ObjectId(categoryId),
      userInfo._id,
    );

    if (!result) {
      throw ExceptionFactory.create({ moduleName: 'categories', code: 'CATEGORY_ALREADY_EXISTS' }, null);
    }

    return new ResponseAdapter(result, {
      type: EXCEPTION_TYPES.SUCCESS,
      message: CATEGORY_MESSAGES.SUCCESS_UPDATED,
    });
  }

  @Delete(':categoryId')
  @UseGuards(SessionGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить категорию операций' })
  @ApiCookieAuth(COOKIE_NAMES.ACCESS_TOKEN)
  @ApiOkResponse({
    description: 'Запрос выполнен успешно, возвращается модель удаленной категории',
    type: ApiCategoryResponseDto,
  })
  @ApiResponse(DEFAULT_SWAGGER_RESPONSE)
  async removeCategory(
    @Param('categoryId') categoryId: string,
    @UserInfo() userInfo: TUserDocument,
  ): Promise<ApiCategoryResponseDto> {
    const categoryObjectId = new mongoose.Types.ObjectId(categoryId);
    const result: TCategoryDocument | null = await this.categoryService.removeCategory(categoryObjectId, userInfo);

    if (!result) {
      throw ExceptionFactory.create({ moduleName: 'categories', code: 'NOT_REMOVED' }, null);
    }

    return new ResponseAdapter(result, {
      type: EXCEPTION_TYPES.SUCCESS,
      message: CATEGORY_MESSAGES.SUCCESS_REMOVED,
    });
  }
}
