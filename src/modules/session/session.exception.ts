import { HttpException, HttpStatus } from '@nestjs/common';
import { exhaustiveCheck } from '../../utils/exception.data';
import { RejectException } from '../../utils/exception/reject.exception';
import { IExceptionFactoryModulesMap, TExceptionMeta } from '../../utils/exception/types';
import { CUSTOM_SESSION_STATUS_CODES, SESSION_MESSAGES } from "./session.constants";

export type TSessionExceptionCodes =
  | 'USER_HAS_SESSION'
  | 'USER_INCORRECT_PASSWORD'
  | 'USER_CANT_CREATE_SESSION'
  | 'USER_NOT_AUTHORIZED'
  | 'USER_CANT_CHECK_SESSION'
  | 'NOT_FOUND_SESSION'
  | 'REG_CANT_CREATE_BASE_WALLETS'
  | 'ACCOUNT_HACKING_ATTEMPT';

export abstract class SessionException {
  static create<Data>(module: IExceptionFactoryModulesMap['session'], data?: Data | null, meta?: TExceptionMeta): HttpException {
    switch (module.code) {
      case 'USER_HAS_SESSION':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.CONFLICT,
          message: SESSION_MESSAGES.USER_HAS_SESSION,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'USER_INCORRECT_PASSWORD':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: SESSION_MESSAGES.USER_INCORRECT_PASSWORD,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'USER_CANT_CREATE_SESSION':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: SESSION_MESSAGES.USER_CANT_CREATE_SESSION,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'USER_NOT_AUTHORIZED':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.UNAUTHORIZED,
          message: SESSION_MESSAGES.USER_NOT_AUTHORIZED,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'USER_CANT_CHECK_SESSION':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.UNAUTHORIZED,
          message: SESSION_MESSAGES.USER_CANT_CHECK_SESSION,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'NOT_FOUND_SESSION':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.UNAUTHORIZED,
          message: SESSION_MESSAGES.USER_NOT_FOUND_SESSION,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'REG_CANT_CREATE_BASE_WALLETS':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: SESSION_MESSAGES.REG_CANT_CREATE_BASE_WALLETS,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'ACCOUNT_HACKING_ATTEMPT':
        return new RejectException({
          data: data || null,
          statusCode: CUSTOM_SESSION_STATUS_CODES.ACCOUNT_HACKING_ATTEMPT,
          message: SESSION_MESSAGES.ACCOUNT_HACKING_ATTEMPT,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        })
    }

    exhaustiveCheck(module.code);
  }
}
