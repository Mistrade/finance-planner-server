import { HttpException, HttpStatus } from '@nestjs/common';
import { exhaustiveCheck } from '../../utils/exception.data';
import { RejectException } from '../../utils/exception/reject.exception';
import { IExceptionFactoryModulesMap, TExceptionMeta } from "../../utils/exception/types";
import { CATEGORY_MESSAGES } from './category.constants';

export type TCategoriesExceptionCodes =
  | 'NOT_FOUND_BY_ID'
  | 'NOT_FOUND_LIST'
  | 'CATEGORY_ALREADY_EXISTS'
  | 'NOT_REMOVED';

export abstract class CategoryException<Data> {
  static create<Data>(module: IExceptionFactoryModulesMap['categories'], data?: Data, meta?: TExceptionMeta): HttpException {
    switch (module.code) {
      case 'NOT_FOUND_BY_ID':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.NOT_FOUND,
          message: CATEGORY_MESSAGES.NOT_FOUND_BY_ID,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'NOT_FOUND_LIST':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.NOT_FOUND,
          message: CATEGORY_MESSAGES.NOT_FOUND_LIST,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'CATEGORY_ALREADY_EXISTS':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: CATEGORY_MESSAGES.ALREADY_EXISTS,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'NOT_REMOVED':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: CATEGORY_MESSAGES.NOT_REMOVED,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
    }

    exhaustiveCheck(module.code);
  }
}
