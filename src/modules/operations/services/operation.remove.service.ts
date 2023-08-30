import { InjectModel } from '@nestjs/mongoose';
import mongoose, { mongo, Types } from 'mongoose';
import { ExceptionFactory } from '../../../utils/exception/exception.factory';
import { RejectException } from '../../../utils/exception/reject.exception';
import { WalletCalculateService } from '../../wallets/wallet.calculate.service';
import { Operation, TOperationDocument, TOperationModel } from '../operations.model';

export class OperationRemoveService {
  constructor(
    @InjectModel(Operation.name) private readonly operationModel: TOperationModel,
    private readonly walletCalculateService: WalletCalculateService,
  ) {}

  async removeById(_id: Types.ObjectId, userId: Types.ObjectId): Promise<Operation | RejectException> {
    const doc: TOperationDocument | null = await this.operationModel
      .findOneAndRemove({
        _id,
        user: userId,
      })
      .lean();

    await this.walletCalculateService.calculateRemoveOperation(doc, userId);

    return doc ?? ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' });
  }

  async removeAllByUserId(userId: Types.ObjectId): Promise<mongo.DeleteResult | RejectException> {
    const result: mongoose.mongo.DeleteResult = await this.operationModel.deleteMany({
      user: userId,
    });

    return result.deletedCount
      ? result
      : ExceptionFactory.create({ moduleName: 'operations', code: 'NOTHING_TO_REMOVE' });
  }

  async removeAllByWalletId(
    wallet: Types.ObjectId,
    user: Types.ObjectId,
  ): Promise<mongo.DeleteResult | RejectException> {
    const result: mongo.DeleteResult = await this.operationModel.deleteMany({
      wallet,
      user,
    });

    return result.deletedCount
      ? result
      : ExceptionFactory.create({ moduleName: 'operations', code: 'NOTHING_TO_REMOVE' });
  }
}
