import { Controller, Delete, Get, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { SWAGGER_TAGS } from '../../utils/swagger/swagger.constants';
import { TargetsService } from './targets.service';

@ApiTags(SWAGGER_TAGS.TARGETS)
@Controller('targets')
export class TargetsController {
  constructor(private targetsService: TargetsService) {}

  @Get(':targetId')
  @ApiOperation({ summary: 'Получить цель по ID' })
  getTargetById() {}

  @Get()
  @ApiOperation({ summary: 'Получить все цели' })
  getTargets() {}

  @Post()
  @ApiOperation({ summary: 'Создать цель' })
  createTarget() {}

  @Patch()
  @ApiOperation({ summary: 'Обновить цель' })
  updateTarget() {}

  @Delete()
  @ApiOperation({ summary: 'Удалить цель' })
  removeTarget() {}
}
