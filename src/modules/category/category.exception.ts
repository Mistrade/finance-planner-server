import { HttpException, HttpStatus } from '@nestjs/common';
import { exhaustiveCheck } from '../../utils/exception.data';
import { RejectException } from '../../utils/exception/reject.exception';
import { IExceptionFactoryModulesMap } from '../../utils/exception/types';
import { CATEGORY_MESSAGES } from './category.constants';

export type TCategoriesExceptionCodes =
  | 'NOT_FOUND_BY_ID'
  | 'NOT_FOUND_LIST'
  | 'CATEGORY_ALREADY_EXISTS'
  | 'NOT_REMOVED';

export abstract class CategoryException<Data> {
  static create<Data>(
    module: IExceptionFactoryModulesMap['categories'],
    data?: Data,
  ): HttpException {
    switch (module.code) {
      case 'NOT_FOUND_BY_ID':
        return new RejectException(
          data || null,
          HttpStatus.NOT_FOUND,
          CATEGORY_MESSAGES.NOT_FOUND_BY_ID,
        );
      case 'NOT_FOUND_LIST':
        return new RejectException(
          data || null,
          HttpStatus.NOT_FOUND,
          CATEGORY_MESSAGES.NOT_FOUND_LIST,
        );
      case 'CATEGORY_ALREADY_EXISTS':
        return new RejectException(
          data || null,
          HttpStatus.BAD_REQUEST,
          CATEGORY_MESSAGES.ALREADY_EXISTS,
        );
      case 'NOT_REMOVED':
        return new RejectException(
          data || null,
          HttpStatus.BAD_REQUEST,
          CATEGORY_MESSAGES.NOT_REMOVED,
        );
    }

    exhaustiveCheck(module.code);
  }
}
