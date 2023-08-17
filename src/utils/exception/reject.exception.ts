import { HttpException } from '@nestjs/common';
import { ResponseAdapter } from '../adapters/response.adapter';
import { EXCEPTION_TYPES } from '../exception.data';
import { DEFAULT_REJECT_MESSAGE } from '../global.constants';

export class RejectException<T> extends HttpException {
  constructor(
    data: T | null,
    statusCode: number,
    message?: string,
    type?: EXCEPTION_TYPES,
  ) {
    super(
      new ResponseAdapter(data, {
        type: type || EXCEPTION_TYPES.ERROR,
        message: message || DEFAULT_REJECT_MESSAGE,
      }),
      statusCode,
    );
  }
}
