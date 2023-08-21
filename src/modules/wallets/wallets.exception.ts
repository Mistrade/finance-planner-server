import { HttpException, HttpStatus } from '@nestjs/common';
import { exhaustiveCheck } from '../../utils/exception.data';
import { RejectException } from '../../utils/exception/reject.exception';
import { IExceptionFactoryModulesMap, TExceptionMeta } from "../../utils/exception/types";
import { WALLET_MESSAGES } from './wallets.constants';

export type TWalletExceptionModule = IExceptionFactoryModulesMap['wallets'];

export type TWalletsExceptionCodes =
  | 'NOT_FOUND'
  | 'NOT_FOUND_OR_CANT_DELETE'
  | 'CANT_CREATE_BASE_WALLETS'
  | 'CANT_CREATE_NEW_WALLET';

export abstract class WalletsException<Data> {
  static create<Data>(module: IExceptionFactoryModulesMap['wallets'], data?: Data, meta?: TExceptionMeta): HttpException {
    switch (module.code) {
      case 'NOT_FOUND':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.NOT_FOUND,
          message: WALLET_MESSAGES.DB_NOT_FOUND,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'CANT_CREATE_BASE_WALLETS':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
          message: WALLET_MESSAGES.CANT_CREATE_BASE_WALLET,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'CANT_CREATE_NEW_WALLET':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: WALLET_MESSAGES.CANT_CREATE_NEW_WALLET,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
      case 'NOT_FOUND_OR_CANT_DELETE':
        return new RejectException({
          data: data || null,
          statusCode: HttpStatus.BAD_REQUEST,
          message: WALLET_MESSAGES.NOT_FOUND_OR_CANT_DELETE,
          service: module.moduleName,
          serviceErrorCode: module.code,
          ...meta,
        });
    }

    exhaustiveCheck(module.code);
  }
}
