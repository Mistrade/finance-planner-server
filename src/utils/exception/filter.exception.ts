import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import mongoose from 'mongoose';
import { AuthRequest } from '../../modules/session/session.guard';
import { ResponseAdapter } from '../adapters/response.adapter';
import { EXCEPTION_TYPES, IResponseAdapterInfo } from '../exception.data';
import { RejectException } from './reject.exception';

interface FilterReturned {
  adapterBody: ResponseAdapter<any>;
  statusCode: number;
}

interface LogOptions {
  method: string;
  path: string;
  userId: string | undefined;
  info: IResponseAdapterInfo<any>;
  exception: unknown;
}

@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<AuthRequest>();

    let result: FilterReturned;

    if (exception instanceof mongoose.Error) {
      result = this.getMongooseErrorResult(exception);
    } else if (exception instanceof HttpException) {
      result = this.getHttpExceptionResult(exception);
    } else {
      result = this.getDefaultInternalResult(exception);
    }

    console.log(
      this.log({
        method: req.method,
        info: result.adapterBody.info,
        path: req.path,
        userId: req.user?._id?.toString() || '',
        exception,
      }),
      exception
    );

    return httpAdapter.reply(res, result.adapterBody, result.statusCode);
  }

  private log({ method, exception, path, userId, info }: LogOptions): string {
    const data = [
      `datetime[${new Date().toISOString()}]`,
      `method[${method.toUpperCase()}]`,
      `path[${path}]`,
      `userId[${userId || 'undefined'}]`,
      `description: \"${JSON.stringify(info)}\"`,
    ];

    return data.join(', \n');
  }

  private getHttpExceptionResult(exception: HttpException): FilterReturned {
    const exceptionResponse = exception.getResponse();
    const status = exception.getStatus();
    if (exception instanceof RejectException) {
      return {
        adapterBody: exceptionResponse as ResponseAdapter,
        statusCode: status,
      };
    } else if (exception instanceof BadRequestException) {
      const responseMessage =
        exception.getResponse()['message'] || exception.message;
      const message = Array.isArray(responseMessage)
        ? responseMessage.join(',\n')
        : responseMessage;

      return {
        adapterBody: new ResponseAdapter<any>(null, {
          type: EXCEPTION_TYPES.ERROR,
          message: `ServerHttpError (${exception.name}): Невалидные данные для запроса.`,
          description: message || '',
        }),
        statusCode: exception.getStatus(),
      };
    } else {
      return this.getDefaultInternalResult(exception);
    }
  }

  private getDefaultInternalResult(exception: unknown): FilterReturned {
    const errorName = exception['name'] || '';

    return {
      adapterBody: new ResponseAdapter<any>(null, {
        type: EXCEPTION_TYPES.ERROR,
        message: `ServerHttpError${
          errorName ? ` (${errorName})` : ''
        }: Произошла непредвиденная ошибка на сервере`,
      }),
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
    };
  }

  private getMongooseErrorResult(exception: mongoose.Error): FilterReturned {
    if (exception instanceof mongoose.Error.ValidationError) {
      return {
        adapterBody: new ResponseAdapter<any>(null, {
          type: EXCEPTION_TYPES.ERROR,
          message: `DB.${exception.name}: Произошла ошибка валидации(проверки отправленных данных) на уровне БД(Базы данных).`,
        }),
        statusCode: HttpStatus.BAD_REQUEST,
      };
    } else if (exception instanceof mongoose.Error.DocumentNotFoundError) {
      return {
        adapterBody: new ResponseAdapter<any>(null, {
          type: EXCEPTION_TYPES.ERROR,
          message: `DB.${exception.name}: Запрашиваемый документ не найден.`,
        }),
        statusCode: HttpStatus.NOT_FOUND,
      };
    } else if (exception instanceof mongoose.Error.ParallelSaveError) {
      return {
        adapterBody: new ResponseAdapter<any>(null, {
          type: EXCEPTION_TYPES.ERROR,
          message: `DB.${exception.name}: Произошла ошибка из-за попытки параллельного сохранения данных. Пожалуйста, дождитесь завершения операции.`,
        }),
        statusCode: HttpStatus.BAD_REQUEST,
      };
    } else if (exception instanceof mongoose.Error.VersionError) {
      return {
        adapterBody: new ResponseAdapter<any>(null, {
          type: EXCEPTION_TYPES.ERROR,
          message: `DB.${exception.name}: Ошибка при синхронизации версий документа, повторите попытку позже.`,
        }),
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    } else {
      return {
        adapterBody: new ResponseAdapter<any>(null, {
          type: EXCEPTION_TYPES.ERROR,
          message: `DB.${exception.name}: Произошла непредвиденная ошибка со стороны базы данных, попробуйте повторить операцию позже.`,
        }),
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      };
    }
  }
}
