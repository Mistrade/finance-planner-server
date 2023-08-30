import { ApiProperty } from '@nestjs/swagger';
import { ResponseAdapter, ResponseInfoAdapter } from '../../../utils/adapters/response.adapter';
import { Wallet } from '../wallets.model';

export class ApiWalletsResponseDto implements ResponseAdapter<Wallet> {
  @ApiProperty({
    name: 'data',
    description: 'Модель кошелька',
    type: Wallet,
    nullable: true,
    required: true,
  })
  data: Wallet;

  @ApiProperty({
    name: 'info',
    type: ResponseInfoAdapter,
    description: 'Описание статуса работы метода',
    required: false,
  })
  info?: ResponseInfoAdapter;
}

export class ApiArrayWalletsResponseDto implements ResponseAdapter<Array<Wallet>> {
  @ApiProperty({
    name: 'data',
    description: 'Массив моделей',
    type: [Wallet],
    nullable: true,
    required: true,
  })
  data: Array<Wallet>;

  @ApiProperty({
    name: 'info',
    type: ResponseInfoAdapter,
    description: 'Описание статуса работы метода',
    required: false,
  })
  info?: ResponseInfoAdapter;
}