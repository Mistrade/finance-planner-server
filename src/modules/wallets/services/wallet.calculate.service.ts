import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Types } from 'mongoose';
import { exhaustiveCheck } from '../../../utils/exception.data';
import { OPERATION_STATE, OPERATION_TYPES } from '../../operations/operations.constants';
import { Operation, TOperationDocument } from '../../operations/operations.model';
import { IAggregateOperationsBalance } from '../../operations/operations.types';
import { OperationsFindService } from '../../operations/services/operations.find.service';
import { TUserDocument } from '../../profile/db_models/user.model';
import { TWalletDocument, TWalletModel, Wallet } from '../wallets.model';

type TWalletAggregateHash = Record<string, Array<IAggregateOperationsBalance>>;

export class WalletCalculateService {
  constructor(
    @InjectModel(Wallet.name) private readonly walletModel: TWalletModel,
    private readonly operationsFindService: OperationsFindService,
  ) {}

  private resetWalletStateMutation(wallet: TWalletDocument): TWalletDocument {
    wallet.balance = 0;
    wallet.allConsumptionSum = 0;
    wallet.allIncomeSum = 0;
    wallet.planningConsumption = 0;
    wallet.planningIncome = 0;
    return wallet;
  }

  private checkNeedReCalculateWallet(wallet: TWalletDocument): boolean {
    if (!wallet.lastCalculateDate) return true;

    return dayjs().diff(wallet.lastCalculateDate, 'hour', false) >= 1;
  }

  private buildWalletAggregateHash(data: Array<IAggregateOperationsBalance>): TWalletAggregateHash {
    return data.reduce<TWalletAggregateHash>((acc, value) => {
      const id = value._id.wallet.toString();
      if (!acc[id]) {
        acc[id] = [];
      }
      acc[id].push(value);
      return acc;
    }, {});
  }

  private async getAggregateWalletHash(
    userId: Types.ObjectId,
    walletsId?: Array<Types.ObjectId>,
  ): Promise<TWalletAggregateHash> {
    const data = await this.operationsFindService.aggregateWalletBalance(
      userId,
      walletsId.map((item) => item._id) || undefined,
    );

    return this.buildWalletAggregateHash(data);
  }

  private reCalculateFromHashMutation(hash: TWalletAggregateHash, wallets: Array<TWalletDocument>): void {
    for (const wallet of wallets) {
      const id = wallet._id.toString();
      const aggrHash = hash[id];
      if (!aggrHash || !aggrHash?.length) {
        continue;
      }

      aggrHash.forEach((item) => {
        switch (item._id.state) {
          case OPERATION_STATE.REALISE: {
            wallet.balance += item.balance;

            switch (item._id.type) {
              case OPERATION_TYPES.INCOME: {
                wallet.allIncomeSum += item.balance;
                break;
              }
              case OPERATION_TYPES.CONSUMPTION: {
                wallet.allConsumptionSum += item.balance;
                break;
              }
              default: {
                exhaustiveCheck(item._id.type);
                break;
              }
            }

            break;
          }
          case OPERATION_STATE.PLANNING: {
            switch (item._id.type) {
              case OPERATION_TYPES.INCOME: {
                wallet.planningIncome += item.balance;
                break;
              }
              case OPERATION_TYPES.CONSUMPTION: {
                wallet.planningConsumption += item.balance;
                break;
              }
              default: {
                exhaustiveCheck(item._id.type);
                break;
              }
            }

            break;
          }
          default: {
            exhaustiveCheck(item._id.state);
            return;
          }
        }
      });

      wallet.lastCalculateDate = dayjs().utc().toDate();
    }
  }

  private checkWalletForReCalculate(wallet: TWalletDocument): boolean {
    const needReCalculateWallet = this.checkNeedReCalculateWallet(wallet);

    if (needReCalculateWallet) {
      this.resetWalletStateMutation(wallet);
    }

    return needReCalculateWallet;
  }

  async asyncReCalculateWallets(
    wallets: Array<TWalletDocument>,
    user: Types.ObjectId,
  ): Promise<Array<TWalletDocument>> {
    const walletsForReCalculate = wallets.filter((item) => this.checkWalletForReCalculate(item));

    if (!walletsForReCalculate.length) {
      return wallets;
    }

    const updatedId = walletsForReCalculate.map((item) => item._id);
    const aggregateHash: TWalletAggregateHash = await this.getAggregateWalletHash(user, updatedId);
    this.reCalculateFromHashMutation(aggregateHash, walletsForReCalculate);

    await Promise.all(wallets.map((wallet) => wallet.save()));

    return wallets;
  }

  async calculateWallets(user: Types.ObjectId) {
    const userWallets: Array<TWalletDocument> = await this.walletModel.find({
      user,
    });

    this.asyncReCalculateWallets(userWallets, user)
      .then((res) => console.log(res))
      .catch((reason) => console.log(reason));

    return userWallets;
  }

  async calculateRemoveOperation(operation: Operation, userId: Types.ObjectId): Promise<Wallet | null> {
    const { mainKey, subKey } = this.getWalletCalculateField(operation);

    const wallet: TWalletDocument | null = await this.walletModel.findOne({
      _id: operation.wallet,
      user: userId,
    });

    if (operation.type === OPERATION_TYPES.INCOME) {
      wallet[mainKey] -= Math.abs(operation.cost);
      if (subKey) {
        wallet[subKey] -= Math.abs(operation.cost);
      }
    }

    if (operation.type === OPERATION_TYPES.CONSUMPTION) {
      wallet[mainKey] += Math.abs(operation.cost);
      if (subKey) {
        wallet[subKey] += Math.abs(operation.cost);
      }
    }

    return wallet.save();
  }

  async calculateUpdatedTypeOperation(
    operation: Operation,
    prev: OPERATION_TYPES,
    userId: Types.ObjectId,
  ): Promise<Wallet | null> {
    if (operation.type === prev) return null;

    const wallet: TWalletDocument | null = await this.walletModel.findOne({
      user: userId,
      _id: operation.wallet,
    });

    if (!wallet) return null;

    const cost = operation.cost;

    switch (operation.type) {
      case OPERATION_TYPES.INCOME: {
        switch (operation.state) {
          case OPERATION_STATE.PLANNING: {
            wallet.planningIncome += cost;
            wallet.planningConsumption -= cost;
            break;
          }
          case OPERATION_STATE.REALISE: {
            wallet.balance += cost * 2;
            wallet.allIncomeSum += cost;
            wallet.allConsumptionSum -= cost;
            break;
          }
          default: {
            exhaustiveCheck(operation.state);
            break;
          }
        }

        break;
      }
      case OPERATION_TYPES.CONSUMPTION: {
        switch (operation.state) {
          case OPERATION_STATE.PLANNING: {
            wallet.planningIncome -= cost;
            wallet.planningConsumption += cost;
            break;
          }
          case OPERATION_STATE.REALISE: {
            wallet.balance -= cost * 2;
            wallet.allConsumptionSum += cost;
            wallet.allIncomeSum -= cost;
            break;
          }
          default: {
            exhaustiveCheck(operation.state);
            break;
          }
        }
        break;
      }
      default: {
        exhaustiveCheck(operation.type);
        return null;
      }
    }

    return wallet.save({ validateModifiedOnly: true });
  }

  async calculateUpdatedCostOperation(
    operation: Operation,
    prevValue: number,
    userId: Types.ObjectId,
  ): Promise<Wallet | null> {
    if (operation.cost === Math.abs(prevValue)) return null;

    const wallet: TWalletDocument | null = await this.walletModel.findOne({
      user: userId,
      _id: operation.wallet,
    });

    if (!wallet) return null;

    const cost = Math.abs(operation.cost);
    const prev = Math.abs(prevValue);

    const diff = cost - prev;

    switch (operation.state) {
      case OPERATION_STATE.REALISE: {
        switch (operation.type) {
          case OPERATION_TYPES.INCOME: {
            wallet.balance += diff;
            wallet.allIncomeSum += diff;
            break;
          }
          case OPERATION_TYPES.CONSUMPTION: {
            wallet.balance -= diff;
            wallet.allConsumptionSum -= diff;
            break;
          }
          default: {
            exhaustiveCheck(operation.type);
            break;
          }
        }
        break;
      }
      case OPERATION_STATE.PLANNING: {
        switch (operation.type) {
          case OPERATION_TYPES.INCOME: {
            wallet.planningIncome += diff;
            break;
          }
          case OPERATION_TYPES.CONSUMPTION: {
            wallet.planningConsumption += diff;
            break;
          }
          default: {
            exhaustiveCheck(operation.type);
            break;
          }
        }
        break;
      }
      default: {
        exhaustiveCheck(operation.state);
        return null;
      }
    }

    return wallet.save({ validateModifiedOnly: true });
  }

  async calculateUpdatedStateOperation(
    operation: Operation,
    prevState: OPERATION_STATE,
    userId: Types.ObjectId,
  ): Promise<Wallet | null> {
    if (operation.state === prevState) {
      return null;
    }

    const wallet: TWalletDocument | null = await this.walletModel.findOne({
      _id: operation.wallet,
      user: userId,
    });

    if (!wallet) return null;

    const cost = Math.abs(operation.cost);

    switch (operation.state) {
      case OPERATION_STATE.PLANNING: {
        wallet.balance -= cost;

        switch (operation.type) {
          case OPERATION_TYPES.INCOME: {
            wallet.allIncomeSum -= cost;
            wallet.planningIncome += cost;
            break;
          }
          case OPERATION_TYPES.CONSUMPTION: {
            wallet.allConsumptionSum -= cost;
            wallet.planningConsumption += cost;
            break;
          }
          default: {
            exhaustiveCheck(operation.type);
            break;
          }
        }

        break;
      }
      case OPERATION_STATE.REALISE: {
        wallet.balance += cost;

        switch (operation.type) {
          case OPERATION_TYPES.INCOME: {
            wallet.allIncomeSum += cost;
            wallet.planningIncome -= cost;
            break;
          }
          case OPERATION_TYPES.CONSUMPTION: {
            wallet.allConsumptionSum += cost;
            wallet.planningConsumption -= cost;
            break;
          }
          default: {
            exhaustiveCheck(operation.type);
            break;
          }
        }

        break;
      }
      default: {
        exhaustiveCheck(operation.state);
        return null;
      }
    }

    return wallet.save({ validateModifiedOnly: true });
  }

  async calculateNewOperation(operation: TOperationDocument, userInfo: TUserDocument): Promise<TWalletDocument | null> {
    return this.calculateAndSaveWallet(
      this.getWalletCalculateField(operation),
      this.getChangedOperationValue(operation),
      operation,
      userInfo._id,
    );
  }

  private getWalletCalculateField(operation: Operation): IChangedWalletKeys {
    if (operation.state === OPERATION_STATE.REALISE) {
      return {
        mainKey: 'balance',
        subKey: operation.type === OPERATION_TYPES.INCOME ? 'allIncomeSum' : 'allConsumptionSum',
      };
    }

    if (operation.type === OPERATION_TYPES.INCOME) {
      return {
        mainKey: 'planningIncome',
      };
    }

    if (operation.type === OPERATION_TYPES.CONSUMPTION) {
      return {
        mainKey: 'planningConsumption',
      };
    }

    exhaustiveCheck(operation.type);

    return { mainKey: 'balance' };
  }

  private getChangedOperationValue(operation: TOperationDocument): number {
    if (operation.type === OPERATION_TYPES.CONSUMPTION) {
      return -1 * Math.abs(operation.cost);
    }

    return Math.abs(operation.cost);
  }

  private async calculateAndSaveWallet(
    keys: IChangedWalletKeys,
    value: number,
    operation: Operation,
    userId: Types.ObjectId,
  ) {
    const wallet: TWalletDocument | null = await this.walletModel.findOne({
      _id: operation.wallet,
      user: userId,
    });

    if (!wallet) {
      return null;
    }

    wallet[keys.mainKey] += value;
    wallet.lastOperationDate = operation.createdAt;

    if (keys.subKey) {
      wallet[keys.subKey] += Math.abs(value);
    }

    return wallet.save({ validateModifiedOnly: true });
  }
}

interface IChangedWalletKeys {
  mainKey: keyof Pick<Wallet, 'balance' | 'planningConsumption' | 'planningIncome'>;
  subKey?: keyof Pick<Wallet, 'allConsumptionSum' | 'allIncomeSum'>;
}
