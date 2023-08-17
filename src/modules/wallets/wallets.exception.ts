import { HttpException, HttpStatus } from '@nestjs/common';
import { exhaustiveCheck } from '../../utils/exception.data';
import { RejectException } from '../../utils/exception/reject.exception';
import { IExceptionFactoryModulesMap } from '../../utils/exception/types';
import { WALLET_MESSAGES } from './wallets.constants';

export type TWalletExceptionModule = IExceptionFactoryModulesMap['wallets']

export type TWalletsExceptionCodes =
  | 'NOT_FOUND'
| 'NOT_FOUND_OR_CANT_DELETE'
  | 'CANT_CREATE_BASE_WALLETS'
  | 'CANT_CREATE_NEW_WALLET';

export abstract class WalletsException<Data> {
  static create<Data>(
    module: IExceptionFactoryModulesMap['wallets'],
    data?: Data,
  ): HttpException {
    switch (module.code) {
      case 'NOT_FOUND':
        return new RejectException(
          data || null,
          HttpStatus.NOT_FOUND,
          WALLET_MESSAGES.DB_NOT_FOUND,
        );
      case 'CANT_CREATE_BASE_WALLETS':
        return new RejectException(
          data || null,
          HttpStatus.INTERNAL_SERVER_ERROR,
          WALLET_MESSAGES.CANT_CREATE_BASE_WALLET,
        );
      case 'CANT_CREATE_NEW_WALLET':
        return new RejectException(
          data || null,
          HttpStatus.BAD_REQUEST,
          WALLET_MESSAGES.CANT_CREATE_NEW_WALLET,
        );
      case 'NOT_FOUND_OR_CANT_DELETE':
        return new RejectException(
          data || null,
          HttpStatus.BAD_REQUEST,
          WALLET_MESSAGES.NOT_FOUND_OR_CANT_DELETE
        )
    }

    exhaustiveCheck(module.code);
  }
}
