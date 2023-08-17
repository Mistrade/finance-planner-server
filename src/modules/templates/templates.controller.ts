import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import { TemplatesService } from './templates.service';

@ApiTags(SWAGGER_TAGS.TEMPLATES)
@Controller('templates')
export class TemplatesController {
  constructor(private templateService: TemplatesService) {}

  @Get(':templateId')
  @ApiOperation({ summary: 'Получить шаблон по ID' })
  getTemplateById() {}

  @Get()
  @ApiOperation({ summary: 'Получить список всех шаблонов' })
  getTemplates() {}

  @Post()
  @ApiOperation({ summary: 'Создать шаблон' })
  createTemplate() {}

  @Patch()
  @ApiOperation({ summary: 'Обновить шаблон' })
  updateTemplate() {}

  @Delete()
  @ApiOperation({ summary: 'Удалить шаблон' })
  removeTemplate() {}
}
