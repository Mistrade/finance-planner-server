import { HttpException, HttpStatus } from '@nestjs/common';
import { exhaustiveCheck } from '../../utils/exception.data';
import { RejectException } from '../../utils/exception/reject.exception';
import { IExceptionFactoryModulesMap, TExceptionMeta } from '../../utils/exception/types';
import { OPERATION_API_MESSAGES } from './operations.constants';

export type TOperationExceptionCodes =
  | 'NOTHING_TO_REMOVE'
  | 'NOT_FOUND'
  | 'PREV_VALUE_EQUAL_NEXT'
  | 'DEFAULT'
  | 'INVALID_DATE'
  | 'INVALID_DTO';

export abstract class OperationException {
  static create<Data>(module: IExceptionFactoryModulesMap['operations'], data?: Data | null, meta?: TExceptionMeta): HttpException {
    switch (module.code) {
      case 'NOTHING_TO_REMOVE':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: OPERATION_API_MESSAGES[module.code],
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'NOT_FOUND':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.NOT_FOUND,
          message: OPERATION_API_MESSAGES[module.code],
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'PREV_VALUE_EQUAL_NEXT':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: OPERATION_API_MESSAGES.PREV_EQUAL_WITH_NEXT,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'DEFAULT':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: OPERATION_API_MESSAGES.DEFAULT,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'INVALID_DATE':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: OPERATION_API_MESSAGES.INVALID_DATE,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'INVALID_DTO':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: OPERATION_API_MESSAGES.INVALID_DTO,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        })
    }

    exhaustiveCheck(module.code);
  }
}
