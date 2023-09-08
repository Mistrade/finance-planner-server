import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import {
  LOGIN_MAX_LENGTH_COUNT,
  LOGIN_MIN_LENGTH_COUNT,
  PASSWORD_MAX_LENGTH_COUNT,
  PASSWORD_MIN_LENGTH_COUNT,
  SESSION_MESSAGES,
} from '../session.constants';

export class SessionDto {
  @ApiProperty({
    name: 'login',
    example: 'example@example.com',
    description: 'Email пользователя',
    nullable: false,
    required: true,
    type: String,
  })
  @IsString({ message: SESSION_MESSAGES.LOGIN_SHOULD_BE_STRING })
  @IsEmail({}, { message: SESSION_MESSAGES.LOGIN_SHOULD_BE_EMAIL })
  @MinLength(LOGIN_MIN_LENGTH_COUNT, {
    message: SESSION_MESSAGES.LOGIN_MIN_LENGTH,
  })
  @MaxLength(LOGIN_MAX_LENGTH_COUNT, {
    message: SESSION_MESSAGES.LOGIN_MAX_LENGTH,
  })
  login: string;

  @ApiProperty({
    name: 'password',
    example: '12345678910',
    description: 'Пароль пользователя',
    nullable: false,
    required: true,
    type: String,
  })
  @IsString({ message: SESSION_MESSAGES.PASSWORD_SHOULD_BE_STRING })
  @MinLength(PASSWORD_MIN_LENGTH_COUNT, {
    message: SESSION_MESSAGES.PASSWORD_MIN_LENGTH,
  })
  @MaxLength(PASSWORD_MAX_LENGTH_COUNT, {
    message: SESSION_MESSAGES.PASSWORD_MAX_LENGTH,
  })
  password: string;
}


export class CreateSessionDto extends SessionDto {
  @ApiProperty({
    type: Boolean,
    description: "Если передано true, то сессия будет жить дольше, чем если передан false."
  })
  saveThisDevice?: boolean;
}
