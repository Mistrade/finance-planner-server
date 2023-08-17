import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';
import { TAG_MESSAGES, TAG_TITLE_MAX_LENGTH, TAG_TITLE_MIN_LENGTH } from '../tags.constants';

export class CreateTagDto {
  @ApiProperty({
    name: 'title',
    description: 'Заголовок тега',
    type: String,
    required: true,
    maxLength: TAG_TITLE_MAX_LENGTH,
    minLength: TAG_TITLE_MIN_LENGTH,
    example: "Топливо"
  })
  @IsString({ message: TAG_MESSAGES.TITLE_SHOULD_BE_STRING })
  @MinLength(TAG_TITLE_MIN_LENGTH, { message: TAG_MESSAGES.TITLE_MIN_LENGTH })
  @MaxLength(TAG_TITLE_MAX_LENGTH, { message: TAG_MESSAGES.TITLE_MAX_LENGTH })
  title: string;
}
