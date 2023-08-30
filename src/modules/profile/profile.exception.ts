import { HttpException, HttpStatus } from '@nestjs/common';
import { exhaustiveCheck } from '../../utils/exception.data';
import { RejectException } from '../../utils/exception/reject.exception';
import { IExceptionFactoryModulesMap, TExceptionMeta } from '../../utils/exception/types';
import { PROFILE_SERVICE_MESSAGES } from './profile.constants';

export type TProfileExceptionCodes = 'USER_NOT_FOUND' | 'USER_ALREADY_EXISTS';

export abstract class ProfileException {
  static create<Data>(module: IExceptionFactoryModulesMap['profile'], data?: Data | null, meta?: TExceptionMeta): HttpException {
    switch (module.code) {
      case 'USER_NOT_FOUND':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.NOT_FOUND,
          message: PROFILE_SERVICE_MESSAGES.USER_NOT_FOUND,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'USER_ALREADY_EXISTS':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: PROFILE_SERVICE_MESSAGES.USER_ALREADY_EXISTS,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
    }

    exhaustiveCheck(module.code);
  }
}
