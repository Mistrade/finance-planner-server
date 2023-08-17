import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { TUserDocument } from '../profile/db_models/user.model';
import { SubscribeService } from '../subscribe/subscribe.service';
import { CreateWalletDto } from './dto/create.wallet.dto';
import { WALLET_CREATOR, WALLET_TYPE } from './wallets.constants';
import { TWalletsExceptionCodes } from './wallets.exception';
import { TWalletDocument, TWalletModel, Wallet } from './wallets.model';

@Injectable()
export class WalletsService {
  constructor(
    @InjectModel(Wallet.name) private readonly walletModel: TWalletModel,
    private readonly subscribeService: SubscribeService,
  ) {}

  async findOneById(
    userId: Types.ObjectId,
    walletId: Types.ObjectId,
  ): Promise<TWalletDocument | null> {
    return this.walletModel.findOne({
      user: userId,
      _id: walletId,
    });
  }

  async findManyByUserId(
    userId: Types.ObjectId,
  ): Promise<Array<TWalletDocument>> {
    return this.walletModel.find({
      user: userId,
    });
  }

  async createBaseWallets(
    userId: Types.ObjectId,
  ): Promise<Array<TWalletDocument>> {
    const baseDebitWallet = await this.walletModel.findOne({
      user: userId,
      creator: WALLET_CREATOR.BASE,
      type: WALLET_TYPE.DEBIT_CARD,
      deletable: false,
    });

    const baseMoneyWallet = await this.walletModel.findOne({
      user: userId,
      creator: WALLET_CREATOR.BASE,
      type: WALLET_TYPE.MONEY,
      deletable: false,
    });

    const items: Array<Partial<TWalletDocument>> = [];
    const result: Array<TWalletDocument> = [];

    if (!baseDebitWallet) {
      items.push({
        name: 'Дебетовая карта',
        type: WALLET_TYPE.DEBIT_CARD,
        balance: 0,
        user: userId,
        deletable: false,
        creator: WALLET_CREATOR.BASE,
      });
    } else {
      result.push(baseDebitWallet);
    }

    if (!baseMoneyWallet) {
      items.push({
        name: 'Наличные',
        type: WALLET_TYPE.MONEY,
        balance: 0,
        user: userId,
        deletable: false,
        creator: WALLET_CREATOR.BASE,
      });
    } else {
      result.push(baseMoneyWallet);
    }

    if (items.length) {
      const insertResult = await this.walletModel.insertMany(items);
      result.push(...insertResult);
    }

    return result;
  }

  async createWallet(
    dto: CreateWalletDto,
    userInfo: TUserDocument,
  ): Promise<TWalletDocument | TWalletsExceptionCodes> {
    const doc: TWalletDocument | null = await new this.walletModel({
      ...dto,
      user: userInfo._id,
      creator: WALLET_CREATOR.USER,
    }).save();

    if (!doc) {
      return 'CANT_CREATE_NEW_WALLET';
    }

    return doc;
  }

  async removeWalletById(
    walletId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<TWalletDocument | null> {
    return this.walletModel.findOneAndRemove({
      user: userId,
      _id: walletId,
      deletable: true
    });
  }

  async removeAllUserWallets(
    userId: Types.ObjectId,
  ): Promise<mongoose.mongo.DeleteResult> {
    return this.walletModel.deleteMany({
      user: userId,
    });
  }
}
