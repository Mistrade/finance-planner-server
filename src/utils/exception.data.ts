import { IExceptionFactoryModuleNames, IExceptionFactoryModulesMap } from './exception/types';

export enum EXCEPTION_TYPES {
  ERROR = 'error',
  WARNING = 'warning',
  INFO = 'info',
  SUCCESS = 'success',
}

export const DEFAULT_HTTP_EXCEPTION_MESSAGE = 'Что-то пошло не по плану...';

export function getDefaultExceptionType(statusCode: number): EXCEPTION_TYPES {
  if (statusCode >= 200 && statusCode < 300) {
    return EXCEPTION_TYPES.SUCCESS;
  }

  if (statusCode >= 300 && statusCode < 400) {
    return EXCEPTION_TYPES.INFO;
  }

  if (statusCode >= 400 && statusCode < 500) {
    return EXCEPTION_TYPES.WARNING;
  }

  return EXCEPTION_TYPES.ERROR;
}

export interface ICustomExceptionOptions {
  statusCode: number;
  message?: string;
  type?: EXCEPTION_TYPES;
}

export interface TResponseInfoData {
  type: EXCEPTION_TYPES;
  message: string;
}

export interface IResponseAdapterInfo<T extends IExceptionFactoryModuleNames> extends TResponseInfoData {
  datetime: string;
  description?: string;
  service?: T;
  serviceErrorCode?: IExceptionFactoryModulesMap[T]['code'];
}

export interface IGenerateHttpExceptionReturned<T> {
  data: T | null;
  info?: TResponseInfoData;
}

export function generateHttpException<T>(
  data: T | null,
  options: ICustomExceptionOptions,
): IGenerateHttpExceptionReturned<T> {
  return {
    data,
    info: {
      type: options.type || getDefaultExceptionType(options.statusCode),
      message: options.message || DEFAULT_HTTP_EXCEPTION_MESSAGE,
    },
  };
}

export function generateSuccessResponseBody<T>(
  data: T | null,
  options?: Omit<ICustomExceptionOptions, 'statusCode'>,
): IGenerateHttpExceptionReturned<T> {
  const response: IGenerateHttpExceptionReturned<T> = {
    data,
  };

  if (options) {
    response.info = {
      type: options.type || EXCEPTION_TYPES.SUCCESS,
      message: options.message || '',
    };
  }

  return response;
}

export function exhaustiveCheck(param: never): void {
  console.error('Не обработано значение', param);
}
