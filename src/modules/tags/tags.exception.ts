import { HttpException, HttpStatus } from '@nestjs/common';
import { exhaustiveCheck } from '../../utils/exception.data';
import { RejectException } from '../../utils/exception/reject.exception';
import { IExceptionFactoryModulesMap } from '../../utils/exception/types';
import { TAG_MESSAGES } from './tags.constants';

export type TTagsExceptionCodes =
  | 'CANT_CREATE'
  | 'NOT_FOUND'
  | 'UPDATE_IMPOSSIBLE_TITLE_IS_ALREADY_EXISTS'
  | 'NOTHING_TO_REMOVE'
  | 'NOT_REMOVED'
  | 'CANT_REMOVED';

export abstract class TagsException<Data> {
  static create<Data>(
    module: IExceptionFactoryModulesMap['tags'],
    data?: Data,
  ): HttpException {
    switch (module.code) {
      case 'CANT_CREATE': {
        return new RejectException(
          data || null,
          HttpStatus.INTERNAL_SERVER_ERROR,
          TAG_MESSAGES.CANT_CREATED,
        );
      }
      case 'NOT_FOUND': {
        return new RejectException(
          data || null,
          HttpStatus.NOT_FOUND,
          TAG_MESSAGES.TAG_NOT_FOUND,
        );
      }
      case 'UPDATE_IMPOSSIBLE_TITLE_IS_ALREADY_EXISTS': {
        return new RejectException(
          data || null,
          HttpStatus.BAD_REQUEST,
          TAG_MESSAGES.UPDATE_TAG_TITLE_ALREADY_EXISTS,
        );
      }
      case 'CANT_REMOVED': {
        return new RejectException(
          data || null,
          HttpStatus.BAD_REQUEST,
          TAG_MESSAGES.CANT_REMOVED,
        );
      }
      case 'NOT_REMOVED': {
        return new RejectException(
          data || null,
          HttpStatus.BAD_REQUEST,
          TAG_MESSAGES.NOT_REMOVED,
        );
      }
      case 'NOTHING_TO_REMOVE': {
        return new RejectException(
          data || null,
          HttpStatus.BAD_REQUEST,
          TAG_MESSAGES.NOTHING_TO_REMOVE,
        );
      }
    }

    exhaustiveCheck(module.code);
  }
}
