import { Types } from 'mongoose';
import { OPERATION_STATE, OPERATION_TYPES } from './operations.constants';

export interface IAggregateOperationsBalance {
  _id: { wallet: Types.ObjectId; state: OPERATION_STATE; type: OPERATION_TYPES };
  balance: number;
}
