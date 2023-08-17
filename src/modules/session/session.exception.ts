import { HttpException, HttpStatus } from '@nestjs/common';
import { exhaustiveCheck } from '../../utils/exception.data';
import { RejectException } from '../../utils/exception/reject.exception';
import { IExceptionFactoryModulesMap } from '../../utils/exception/types';
import { SESSION_MESSAGES } from './session.constants';

export type TSessionExceptionCodes =
  | 'USER_HAS_SESSION'
  | 'USER_INCORRECT_PASSWORD'
  | 'USER_CANT_CREATE_SESSION'
  | 'USER_NOT_AUTHORIZED'
  | 'USER_CANT_CHECK_SESSION'
  | 'NOT_FOUND_SESSION'
  | 'REG_CANT_CREATE_BASE_WALLETS';

export abstract class SessionException {
  static create<Data>(
    module: IExceptionFactoryModulesMap['session'],
    data?: Data | null,
  ): HttpException {
    switch (module.code) {
      case 'USER_HAS_SESSION':
        return new RejectException(data || null, HttpStatus.CONFLICT, SESSION_MESSAGES.USER_HAS_SESSION);
      case 'USER_INCORRECT_PASSWORD':
        return new RejectException(data || null, HttpStatus.BAD_REQUEST, SESSION_MESSAGES.USER_INCORRECT_PASSWORD);
      case 'USER_CANT_CREATE_SESSION':
        return new RejectException(
          data || null,
          HttpStatus.INTERNAL_SERVER_ERROR,
          SESSION_MESSAGES.USER_CANT_CREATE_SESSION,
        );
      case 'USER_NOT_AUTHORIZED':
        return new RejectException(data || null, HttpStatus.UNAUTHORIZED, SESSION_MESSAGES.USER_NOT_AUTHORIZED);
      case 'USER_CANT_CHECK_SESSION':
        return new RejectException(data || null, HttpStatus.UNAUTHORIZED, SESSION_MESSAGES.USER_CANT_CHECK_SESSION);
      case 'NOT_FOUND_SESSION':
        return new RejectException(data || null, HttpStatus.UNAUTHORIZED, SESSION_MESSAGES.USER_NOT_FOUND_SESSION);
      case 'REG_CANT_CREATE_BASE_WALLETS':
        return new RejectException(data || null, HttpStatus.INTERNAL_SERVER_ERROR, SESSION_MESSAGES.REG_CANT_CREATE_BASE_WALLETS)
    }

    exhaustiveCheck(module.code);
  }
}
