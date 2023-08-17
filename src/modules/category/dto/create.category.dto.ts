import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import {
  CATEGORY_MESSAGES,
  CATEGORY_NAME_MAX_LENGTH,
  CATEGORY_NAME_MIN_LENGTH,
} from '../category.constants';

export class CreateCategoryDto {
  @ApiProperty({
    name: 'name',
    type: String,
    required: false,
    description: 'Название категории',
  })
  @IsString({ message: CATEGORY_MESSAGES.NAME_IS_STRING })
  @MaxLength(CATEGORY_NAME_MAX_LENGTH, {
    message: CATEGORY_MESSAGES.NAME_MAX_LENGTH,
  })
  @MinLength(CATEGORY_NAME_MIN_LENGTH, {
    message: CATEGORY_MESSAGES.NAME_MIN_LENGTH,
  })
  name: string;
}
