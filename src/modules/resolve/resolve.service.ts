import { Injectable } from '@nestjs/common';
import mongoose, { Types } from 'mongoose';

@Injectable()
export class ResolveService {
  constructor() {}

  resolveMongooseObjectIds<T>(arr: Array<string>): { inValid: Array<string>; valid: Array<Types.ObjectId> } {
    const data = Array.from(new Set(arr));
    const inValid: Array<string> = [];
    const valid: Array<Types.ObjectId> = [];

    data.forEach((item) => {
      const isValidObjectId = mongoose.Types.ObjectId.isValid(item);

      if (!isValidObjectId) {
        inValid.push(item);
      } else {
        valid.push(new mongoose.Types.ObjectId(item));
      }
    });

    return {
      valid,
      inValid,
    };
  }
}