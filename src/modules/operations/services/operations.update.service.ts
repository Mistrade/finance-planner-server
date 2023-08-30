import { HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { Types } from 'mongoose';
import { exhaustiveCheck } from '../../../utils/exception.data';
import { ExceptionFactory } from '../../../utils/exception/exception.factory';
import { RejectException } from '../../../utils/exception/reject.exception';
import { CategoryService } from '../../category/category.service';
import { User } from '../../profile/db_models/user.model';
import { ResolveService } from '../../resolve/resolve.service';
import { TagsService } from '../../tags/tags.service';
import { WalletCalculateService } from '../../wallets/services/wallet.calculate.service';
import { UpdateOperationDto } from '../dto/operation.fields.dto';
import { OPERATION_API_MESSAGES, OPERATION_STATE, OPERATION_TYPES } from '../operations.constants';
import { Operation, TOperationDocument, TOperationModel } from '../operations.model';
import { OperationsFindService } from './operations.find.service';

export class OperationsUpdateService {
  constructor(
    @InjectModel(Operation.name) private readonly model: TOperationModel,
    private readonly findService: OperationsFindService,
    private readonly walletCalculateService: WalletCalculateService,
    private readonly resolveService: ResolveService,
    private readonly categoryService: CategoryService,
    private readonly tagsService: TagsService,
  ) {}

  async updateOneById(
    id: Types.ObjectId,
    field: keyof UpdateOperationDto,
    dto: UpdateOperationDto,
    userInfo: User,
  ): Promise<Operation | null | RejectException<Operation>> {
    switch (field) {
      case 'title':
        return this.updateTitle(id, userInfo._id, dto[field]);
      case 'state':
        return this.updateState(id, userInfo._id, dto[field]);
      case 'cost':
        return this.updateCost(id, userInfo._id, dto[field]);
      case 'type':
        return this.updateType(id, userInfo._id, dto[field]);
      case 'description':
        return this.updateDescription(id, userInfo._id, dto[field]);
      case 'date':
        return this.updateDate(id, userInfo._id, dto[field]);
      case 'category':
        return this.updateCategories(id, userInfo._id, dto[field]);
      case 'tags':
        return this.updateTags(id, userInfo._id, dto[field]);
      default: {
        exhaustiveCheck(field);
        return new RejectException({
          data: null,
          message: `Ключ: ${field} - ${OPERATION_API_MESSAGES.UNDEFINED_UPDATE_PROPERTY}`,
          statusCode: HttpStatus.BAD_REQUEST,
          service: 'operations',
          serviceErrorCode: 'DEFAULT',
        });
      }
    }
  }

  private async updateDescription(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    value: string,
  ): Promise<TOperationDocument | null | RejectException<Operation>> {
    const doc: TOperationDocument | null = await this.findService.findById(id, userId);

    if (!doc) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' }, null);
    }
    if (doc.description === value) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'PREV_VALUE_EQUAL_NEXT' }, null);
    }

    doc.description = value || '';

    return doc.save({ validateModifiedOnly: true });
  }

  private async updateDate(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    value: string,
  ): Promise<TOperationDocument | null | RejectException<Operation>> {
    const date = dayjs(value).utc();

    if (!date.isValid()) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'INVALID_DATE' }, null);
    }

    const doc: TOperationDocument | null = await this.findService.findById(id, userId);

    if (!doc) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' }, null);
    }

    doc.date = date.toDate();

    return doc.save({ validateModifiedOnly: true });
  }

  private async updateCategories(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    value: string | Array<string>,
  ): Promise<TOperationDocument | null | RejectException<Operation>> {
    if (!value) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'INVALID_DTO' });
    }

    const values = typeof value === 'string' ? [value] : Array.isArray(value) ? value : null;

    if (!values) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'INVALID_DTO' });
    }

    const categories = await this.categoryService.resolveStringCategories(values, userId);

    const doc = await this.findService.findById(id, userId);

    if (!doc) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' });
    }

    doc.category = categories;

    return doc.save({ validateModifiedOnly: true });
  }

  private async updateTags(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    value: string | Array<string>,
  ): Promise<TOperationDocument | null | RejectException> {
    if (!value) return ExceptionFactory.create({ moduleName: 'operations', code: 'INVALID_DTO' });

    const values = typeof value === 'string' ? [value] : Array.isArray(value) ? value : null;

    if (!values) return ExceptionFactory.create({ moduleName: 'operations', code: 'INVALID_DTO' });

    const tags = await this.tagsService.resolveStringTags(values, userId);

    const doc = await this.findService.findById(id, userId);

    if (!doc) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' });
    }

    doc.tags = tags;

    return doc.save({ validateModifiedOnly: true });
  }

  private async updateType(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    value: OPERATION_TYPES,
  ): Promise<TOperationDocument | null | RejectException> {
    if (!value || !Object.values(OPERATION_TYPES).includes(value)) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'INVALID_DTO' });
    }

    const doc = await this.findService.findById(id, userId);

    if (!doc) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' });
    }

    if (doc.type === value) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'PREV_VALUE_EQUAL_NEXT' });
    }

    const prev = doc.type;
    doc.type = value;

    await Promise.all([
      doc.save({ validateModifiedOnly: true }),
      this.walletCalculateService.calculateUpdatedTypeOperation(doc, prev, userId),
    ]);
    
    return doc;
  }

  private async updateCost(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    value: number,
  ): Promise<TOperationDocument | null | RejectException> {
    if (value <= 0) {
      return ExceptionFactory.create({ moduleName: 'operations', code: 'INVALID_DTO' });
    }

    const doc = await this.findService.findById(id, userId);
    if (!doc) return ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' });
    if (doc.cost === value) return ExceptionFactory.create({ moduleName: 'operations', code: 'PREV_VALUE_EQUAL_NEXT' });

    const prevState = Math.abs(doc.cost);
    doc.cost = Math.abs(value);

    await Promise.all([
      doc.save({ validateModifiedOnly: true }),
      this.walletCalculateService.calculateUpdatedCostOperation(doc, prevState, userId),
    ]);

    return doc;
  }

  private async updateTitle(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    value: string,
  ): Promise<TOperationDocument | null | RejectException> {
    if (!value) return ExceptionFactory.create({ moduleName: 'operations', code: 'INVALID_DTO' });

    const doc = await this.findService.findById(id, userId);
    if (!doc) return ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' });

    doc.title = value;

    return doc.save({ validateModifiedOnly: true });
  }

  private async updateState(
    id: Types.ObjectId,
    userId: Types.ObjectId,
    value: OPERATION_STATE,
  ): Promise<TOperationDocument | null | RejectException> {
    if (!value || !Object.values(OPERATION_STATE).includes(value))
      return ExceptionFactory.create({ moduleName: 'operations', code: 'INVALID_DTO' });

    const doc = await this.findService.findById(id, userId);
    if (!doc) return ExceptionFactory.create({ moduleName: 'operations', code: 'NOT_FOUND' });
    if (doc.state === value)
      return ExceptionFactory.create({ moduleName: 'operations', code: 'PREV_VALUE_EQUAL_NEXT' });

    const prevState = doc.state;
    doc.state = value;

    await Promise.all([
      doc.save({ validateModifiedOnly: true }),
      this.walletCalculateService.calculateUpdatedStateOperation(doc, prevState, userId),
    ]);

    return doc;
  }
}
