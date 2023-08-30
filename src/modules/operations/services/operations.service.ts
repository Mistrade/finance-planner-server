import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs, { Dayjs } from 'dayjs';
import mongoose, { Types } from 'mongoose';
import { CategoryService } from '../../category/category.service';
import { TUserDocument, User } from '../../profile/db_models/user.model';
import { SubscribeService } from '../../subscribe/subscribe.service';
import { TagsService } from '../../tags/tags.service';
import { TargetsService } from '../../targets/targets.service';
import { TemplatesService } from '../../templates/templates.service';
import { WalletCalculateService } from '../../wallets/wallet.calculate.service';
import { WalletsService } from '../../wallets/wallets.service';
import { CreateOperationDto } from '../dto/create.operation.dto';
import { OPERATION_REPEAT_PATTERNS, OPERATION_STATE, OPERATION_TYPES } from '../operations.constants';
import { Operation, TOperationDocument, TOperationModel } from '../operations.model';
import { OperationsBuilderService } from './operations.builder.service';

@Injectable()
export class OperationsService {
  constructor(
    private readonly tagService: TagsService,
    private readonly categoryServices: CategoryService,
    private readonly walletService: WalletsService,
    private readonly templateService: TemplatesService,
    private readonly targetService: TargetsService,
    private readonly operationsBuildService: OperationsBuilderService,
    private readonly subscribeService: SubscribeService,
    private readonly walletCalculateService: WalletCalculateService,
    @InjectModel(Operation.name) private readonly operationModel: TOperationModel,
  ) {}

  async createMany(user: User) {
    const wallets = await this.walletService.findManyByUserId(user._id);

    const typesArr = Object.values(OPERATION_TYPES);
    const statesArr = Object.values(OPERATION_STATE);

    const arr: Array<Partial<Operation>> = [];

    for (let i = 0; i < 500_000; i++) {
      const randomCost = Math.round(Math.random() * 100000);
      const type = typesArr[Math.round(Math.random() * (typesArr.length - 1))];
      const cost = type === OPERATION_TYPES.INCOME ? randomCost : -1 * randomCost;
      const state = statesArr[Math.round(Math.random() * (statesArr.length - 1))];

      arr.push({
        type,
        state,
        date: dayjs().utc().toDate(),
        title: `TEST_${Math.random() * 1_000_000}`,
        tags: [],
        category: [],
        target: null,
        user: user._id,
        wallet: wallets[Math.round(Math.random() * (wallets.length - 1))]._id,
        cost,
      });
    }

    await this.operationModel.insertMany(arr);

    return [];
  }

  async removeOperation(operationId: Types.ObjectId, userId: Types.ObjectId): Promise<Operation | null> {
    const operation = await this.operationModel.findOneAndRemove({
      user: userId,
      _id: operationId,
    });

    if (!operation) {
      return null;
    }

    await this.walletCalculateService.calculateRemoveOperation(operation, userId);

    return operation;
  }

  async createOperation(dto: CreateOperationDto, userInfo: TUserDocument): Promise<Operation | null> {
    const {
      title,
      wallet,
      description = '',
      date = dayjs().utc().toDate(),
      endRepeatDate = undefined,
      repeat = false,
      repeatPattern = OPERATION_REPEAT_PATTERNS.EVERY_DAY,
      cost = 0,
      tags = [],
      target = null,
      state = OPERATION_STATE.REALISE,
      category = [],
      type,
    } = dto;

    const resultTags = await this.tagService.resolveStringTags(tags, userInfo._id);
    const resultCategories = await this.categoryServices.resolveStringCategories(category, userInfo._id);
    const operationDate: Dayjs = date ? dayjs(date).utc() : dayjs().utc();
    const repeatValue = this.isValidRepeatValue(repeat, repeatPattern);
    const resultEndRepeatDate = this.getEndRepeatDate(repeatValue, endRepeatDate);
    const resultType = type ? type : cost > 0 ? OPERATION_TYPES.INCOME : OPERATION_TYPES.CONSUMPTION;

    const operation: TOperationDocument = new this.operationModel({
      title,
      description,
      user: userInfo._id,
      cost: resultType === OPERATION_TYPES.INCOME ? Math.abs(cost) : -1 * Math.abs(cost),
      state,
      wallet: new mongoose.Types.ObjectId(wallet),
      date: operationDate.toDate(),
      repeat: repeatValue,
      repeatPattern: repeatValue ? repeatPattern : null,
      endRepeatDate: resultEndRepeatDate,
      repeatSource: null,
      tags: resultTags,
      category: resultCategories,
      target,
      type: resultType,
    });

    await operation.save();
    await this.walletCalculateService.calculateNewOperation(operation, userInfo);

    return this.populateBaseOperationFields(operation);
  }

  private populateBaseOperationFields(operation: TOperationDocument): Promise<TOperationDocument> {
    const populatePaths: Array<keyof Operation> = ['tags', 'category'];
    return operation.populate(populatePaths);
  }

  private isValidRepeatValue(repeat: boolean, repeatPattern?: OPERATION_REPEAT_PATTERNS): boolean {
    return !!repeat && !!repeatPattern;
  }

  private getEndRepeatDate(repeat: boolean, endRepeatDate?: string | Dayjs | Date): Date | null {
    if (!repeat) {
      return null;
    }

    const endDate = dayjs(endRepeatDate);

    if (endRepeatDate && endDate.isValid()) {
      return endDate.toDate();
    }

    return null;
  }
}
