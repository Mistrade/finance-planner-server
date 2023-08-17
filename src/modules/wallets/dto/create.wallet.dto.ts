import { ApiProperty } from '@nestjs/swagger';
import {
  IsEnum,
  IsNumber,
  IsString,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  WALLET_MESSAGES,
  WALLET_NAME_MAX_LENGTH,
  WALLET_NAME_MIN_LENGTH,
  WALLET_TYPE,
} from '../wallets.constants';
import { Wallet } from '../wallets.model';

export class CreateWalletDto
  implements Pick<Wallet, 'balance' | 'name' | 'type'>
{
  @IsNumber({}, { message: WALLET_MESSAGES.BALANCE_SHOULD_BE_NUMBER })
  @ApiProperty({ name: 'balance', type: Number })
  balance: number;

  @IsString({ message: WALLET_MESSAGES.NAME_SHOULD_BE_STRING })
  @MinLength(WALLET_NAME_MIN_LENGTH, {
    message: WALLET_MESSAGES.NAME_MIN_LENGTH,
  })
  @MaxLength(WALLET_NAME_MAX_LENGTH, {
    message: WALLET_MESSAGES.NAME_MAX_LENGTH,
  })
  @ApiProperty({ name: 'name', type: String })
  name: string;

  @IsEnum(Object.values(WALLET_TYPE), {
    message: WALLET_MESSAGES.TYPE_SHOULD_BE_ENUM,
  })
  @ApiProperty({ name: 'type', type: String, enum: Object.values(WALLET_TYPE) })
  type: WALLET_TYPE;
}
