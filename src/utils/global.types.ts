import { EXCEPTION_TYPES } from './exception.data';

export type CustomResponse<DataType> = {
  data: DataType | null;
  info?: {
    type: EXCEPTION_TYPES;
    message: string;
    datetime: string;
  };
};
