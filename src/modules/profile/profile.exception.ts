import { HttpException, HttpStatus } from '@nestjs/common';
import { exhaustiveCheck } from '../../utils/exception.data';
import { RejectException } from '../../utils/exception/reject.exception';
import { IExceptionFactoryModulesMap } from '../../utils/exception/types';
import { PROFILE_SERVICE_MESSAGES } from './profile.constants';

export type TProfileExceptionCodes = 'USER_NOT_FOUND' | 'USER_ALREADY_EXISTS';

export abstract class ProfileException {
  static create<Data>(
    module: IExceptionFactoryModulesMap['profile'],
    data?: Data | null,
  ): HttpException {
    switch (module.code) {
      case 'USER_NOT_FOUND':
        return new RejectException(
          data || null,
          HttpStatus.NOT_FOUND,
          PROFILE_SERVICE_MESSAGES.USER_NOT_FOUND,
        );
      case 'USER_ALREADY_EXISTS':
        return new RejectException(
          data || null,
          HttpStatus.BAD_REQUEST,
          PROFILE_SERVICE_MESSAGES.USER_ALREADY_EXISTS,
        );
    }

    exhaustiveCheck(module.code);
  }
}
