import { HttpException } from '@nestjs/common';
import { ResponseAdapter } from '../adapters/response.adapter';
import { EXCEPTION_TYPES, IResponseAdapterInfo } from '../exception.data';
import { DEFAULT_REJECT_MESSAGE } from '../global.constants';
import { IExceptionFactoryModuleNames } from './types';

interface IRejectExceptionProps<T, Service extends IExceptionFactoryModuleNames>
  extends Pick<IResponseAdapterInfo<Service>, 'service' | 'serviceErrorCode' | 'description'> {
  data: T | null;
  statusCode: number;
  message?: string;
  type?: EXCEPTION_TYPES;
}

export class RejectException<T = any, Service extends IExceptionFactoryModuleNames = 'profile'> extends HttpException {
  constructor({
    data,
    type,
    message,
    statusCode,
    serviceErrorCode,
    service,
    description,
  }: IRejectExceptionProps<T, Service>) {
    super(
      new ResponseAdapter(data, {
        type: type || EXCEPTION_TYPES.ERROR,
        message: message || DEFAULT_REJECT_MESSAGE,
        service,
        serviceErrorCode,
        description,
      }),
      statusCode,
    );
  }
}
