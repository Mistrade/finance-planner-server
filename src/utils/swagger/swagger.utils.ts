import { HttpStatus } from '@nestjs/common';
import { ApiHeaderOptions, ApiResponseOptions } from '@nestjs/swagger';
import { COOKIE_NAMES, SESSION_MESSAGES } from '../../modules/session/session.constants';
import { ResponseAdapter } from '../adapters/response.adapter';
import { EXCEPTION_TYPES } from '../exception.data';

export interface SwaggerExamples {
  ok?: ApiResponseOptions;
  unAuth?: ApiResponseOptions;
  notFound?: ApiResponseOptions;
}

export const ApiHeaderTemplate: ApiHeaderOptions = {
  name: COOKIE_NAMES.ACCESS_TOKEN,
  description: 'Токен сессии, возвращаемый методом signIn',
  required: true,
};

export const unAuthorizedSwaggerResponse: ApiResponseOptions = {
  description: 'Пользователь не авторизован или данные о пользователе не найдены',
  status: HttpStatus.UNAUTHORIZED,
  schema: {
    type: 'object',
    example: {
      data: null,
      info: {
        type: EXCEPTION_TYPES.ERROR,
        message: SESSION_MESSAGES.USER_NOT_AUTHORIZED,
      },
    },
  },
};

export const DEFAULT_SWAGGER_RESPONSE: ApiResponseOptions = {
  type: ResponseAdapter,
  description: 'Любой другой формат ответа',
  status: 'default',
};
