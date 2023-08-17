import { EXCEPTION_TYPES, IResponseAdapterInfo } from "./exception.data";

export type CustomResponse<DataType> = {
  data: DataType | null;
  info?: {
    type: EXCEPTION_TYPES;
    message: string;
    datetime: string;
  };
};
