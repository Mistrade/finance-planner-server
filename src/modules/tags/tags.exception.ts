import { HttpException, HttpStatus } from '@nestjs/common';
import { exhaustiveCheck, IResponseAdapterInfo } from '../../utils/exception.data';
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
    meta?: Pick<IResponseAdapterInfo<any>, 'description'>,
  ): HttpException {
    switch (module.code) {
      case 'CANT_CREATE': {
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: TAG_MESSAGES.CANT_CREATED,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      }
      case 'NOT_FOUND': {
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.NOT_FOUND,
          message: TAG_MESSAGES.TAG_NOT_FOUND,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      }
      case 'UPDATE_IMPOSSIBLE_TITLE_IS_ALREADY_EXISTS': {
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: TAG_MESSAGES.UPDATE_TAG_TITLE_ALREADY_EXISTS,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta
        });
      }
      case 'CANT_REMOVED': {
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: TAG_MESSAGES.CANT_REMOVED,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      }
      case 'NOT_REMOVED': {
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: TAG_MESSAGES.NOT_REMOVED,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      }
      case 'NOTHING_TO_REMOVE': {
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: TAG_MESSAGES.NOTHING_TO_REMOVE,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      }
    }

    exhaustiveCheck(module.code);
  }
}
