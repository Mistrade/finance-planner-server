import { ApiProperty } from '@nestjs/swagger';
import { EXCEPTION_TYPES, IResponseAdapterInfo } from '../exception.data';
import { CustomResponse } from '../global.types';

export class ResponseInfoAdapter implements IResponseAdapterInfo<any> {
  @ApiProperty({
    name: 'type',
    enum: Object.values(EXCEPTION_TYPES),
    description: 'Статус обработки запроса',
    required: true,
  })
  type: EXCEPTION_TYPES;

  @ApiProperty({
    name: 'message',
    description: 'Короткое описание результата работы метода',
    type: String,
    required: true,
  })
  message: string;

  @ApiProperty({
    name: 'description',
    type: String,
    description: 'Подробное описание результата работы метода (опционально)',
    required: false,
  })
  description?: string;

  @ApiProperty({
    name: 'datetime',
    type: String,
    description: 'Время возврата ответа в ISO формате',
    required: true,
  })
  datetime: string;

  @ApiProperty({
    name: 'service',
    required: false,
    nullable: false,
    type: String,
    description: 'Наименование сервиса, в котором произошла ошибка',
  })
  service?: string;

  @ApiProperty({
    name: 'serviceErrorCode',
    required: false,
    nullable: false,
    type: String,
    description: 'Внутренний код ошибки сервиса, в котором произошла ошибка.',
  })
  serviceErrorCode?: string;

  constructor(data?: Omit<ResponseInfoAdapter, 'datetime'>) {
    this.datetime = new Date().toISOString();
    this.message = data?.message;
    this.description = data?.description;
    this.type = data?.type;
    this.service = data?.service;
    this.serviceErrorCode = data?.serviceErrorCode;
  }
}

export class ResponseAdapter<T = any> implements CustomResponse<T> {
  @ApiProperty({
    name: 'data',
    description: 'Здесь хранятся данные',
    default: null,
    nullable: true,
  })
  data: T | null;
  @ApiProperty({
    name: 'info',
    description: 'Описание результата работы методы',
    type: ResponseInfoAdapter,
  })
  info?: ResponseInfoAdapter;

  constructor(data: T | null, info?: Omit<IResponseAdapterInfo<any>, 'datetime'>) {
    this.data = data;
    this.info = new ResponseInfoAdapter(info);
  }
}
