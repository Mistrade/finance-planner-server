import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import dayjs, { Dayjs } from 'dayjs';
import mongoose, { AnyObject, Types } from 'mongoose';
import { User } from '../../profile/db_models/user.model';
import { FindOperationsQueryDto } from '../dto/find.operations.query.dto';
import { OPERATION_STATE, OPERATION_TYPES } from '../operations.constants';
import { Operation, TOperationDocument, TOperationModel } from '../operations.model';

@Injectable()
export class OperationsFindService {
  constructor(@InjectModel(Operation.name) private readonly operationModel: TOperationModel) {
  }
  
  async findById(id: Types.ObjectId, userId: Types.ObjectId): Promise<TOperationDocument | null> {
    return this.operationModel.findOne({
      _id: id,
      user: userId,
    });
  }
  
  async findByFilters(filtersDto: FindOperationsQueryDto, userInfo: User): Promise<Array<Operation>> {
    const filters = this.buildFilters(filtersDto, userInfo);
    
    console.log('фильтры для поиска: ', filters);
    
    return this.operationModel.find(filters);
  }
  
  private buildFilters(filters: FindOperationsQueryDto, userInfo?: User): Partial<Record<keyof Operation, any>> {
    const {
      title,
      target,
      maxCost,
      minCost,
      type,
      categories,
      tags,
      state,
      walletIds,
      excludeWalletIds,
      toDate,
      fromDate,
      cost,
    } = filters;
    
    const resultFilters: Partial<Record<keyof Operation, any>> = {};
    const dateFilters = this.buildDateFilters(fromDate, toDate);
    const costFilters = this.buildCostFilters({ cost, minCost, maxCost });
    const walletFilters = this.buildWalletFilters({ excludeWalletIds, walletIds });
    const tagsFilters = this.buildTagFilters({ tags });
    const categoriesFilters = this.buildCategoriesFilters({ categories });
    
    if (userInfo?._id) {
      resultFilters['user'] = userInfo._id;
    }
    
    if (dateFilters) {
      resultFilters['date'] = dateFilters;
    }
    
    if (costFilters != null) {
      resultFilters['cost'] = costFilters;
    }
    
    if (walletFilters) {
      resultFilters['wallet'] = walletFilters;
    }
    
    if (tagsFilters) {
      resultFilters['tags'] = tagsFilters;
    }
    
    if (categoriesFilters) {
      resultFilters['category'] = categoriesFilters;
    }
    
    if (title) {
      resultFilters['title'] = {
        $regex: title,
        $options: 'i',
      };
    }
    
    if (target && mongoose.Types.ObjectId.isValid(target)) {
      resultFilters['target'] = target;
    }
    
    if (type && Object.values(OPERATION_TYPES).includes(type)) {
      resultFilters['type'] = type;
    }
    
    if (state && Object.values(OPERATION_STATE).includes(state)) {
      resultFilters['state'] = state;
    }
    
    return resultFilters;
  }
  
  private buildCategoriesFilters({
                                   categories,
                                 }: Pick<FindOperationsQueryDto, 'categories'>): AnyObject | Types.ObjectId | null {
    if (Array.isArray(categories) && categories.length) {
      const validCategories = categories.filter((category) => mongoose.Types.ObjectId.isValid(category));
      
      return {
        $in: validCategories.map((category) => new mongoose.Types.ObjectId(category)),
      };
    }
    
    if (categories && typeof categories === 'string' && mongoose.Types.ObjectId.isValid(categories)) {
      return new mongoose.Types.ObjectId(categories);
    }
    
    return null;
  }
  
  private buildTagFilters({ tags }: Pick<FindOperationsQueryDto, 'tags'>): AnyObject | Types.ObjectId | null {
    if (Array.isArray(tags) && tags.length) {
      const validTags = tags.filter((tag) => mongoose.Types.ObjectId.isValid(tag));
      
      return {
        $in: validTags.map((tag) => new mongoose.Types.ObjectId(tag)),
      };
    }
    
    if (tags && typeof tags === 'string' && mongoose.Types.ObjectId.isValid(tags)) {
      return new mongoose.Types.ObjectId(tags);
    }
    
    return null;
  }
  
  private buildWalletFilters({
                               walletIds,
                               excludeWalletIds,
                             }: Pick<FindOperationsQueryDto, 'walletIds' | 'excludeWalletIds'>): AnyObject | Types.ObjectId | null {
    if (walletIds) {
      if (typeof walletIds === 'string' && mongoose.Types.ObjectId.isValid(walletIds)) {
        return new mongoose.Types.ObjectId(walletIds);
      }
      
      if (Array.isArray(walletIds) && walletIds.length) {
        const validIds = walletIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
        
        return {
          $in: validIds.map((id) => new mongoose.Types.ObjectId(id)),
        };
      }
    }
    
    if (excludeWalletIds) {
      if (typeof excludeWalletIds === 'string' && mongoose.Types.ObjectId.isValid(excludeWalletIds)) {
        return new mongoose.Types.ObjectId(excludeWalletIds);
      }
      
      if (Array.isArray(excludeWalletIds) && excludeWalletIds.length) {
        const validIds = excludeWalletIds.filter((id) => mongoose.Types.ObjectId.isValid(id));
        
        return {
          $ne: validIds.map((id) => new mongoose.Types.ObjectId(id)),
        };
      }
    }
    
    return null;
  }
  
  private buildDateFilters(fromDate?: string | Dayjs | Date, toDate?: string | Dayjs | Date): AnyObject | null {
    if (!fromDate && !toDate) {
      return null;
    }
    
    let result: AnyObject | null = null;
    const startDate = dayjs(fromDate).utc();
    const endDate = dayjs(toDate).utc();
    const isValidStartDate = fromDate ? startDate.isValid() : false;
    const isValidEndDate = toDate ? endDate.isValid() : false;
    
    if (isValidStartDate && isValidEndDate) {
      result = {
        $gte: startDate.toDate(),
        $lte: endDate.toDate(),
      };
    } else if (isValidStartDate) {
      result = {
        $gte: startDate.toDate(),
      };
    } else if (isValidEndDate) {
      result = {
        $lte: endDate.toDate(),
      };
    }
    
    return result;
  }
  
  private buildCostFilters(options: {
    maxCost?: string | number;
    cost?: string | number;
    minCost?: string | number;
  }): AnyObject | number | null {
    const { cost, minCost, maxCost } = options;
    
    if (cost) {
      const value = Number(cost);
      return isNaN(value) ? null : value;
    }
    
    let result: AnyObject = {};
    
    if (minCost && maxCost) {
      const minValue = Number(minCost);
      const maxValue = Number(maxCost);
      
      if (!isNaN(minValue)) {
        result['$gte'] = minValue;
      }
      
      if (!isNaN(maxValue)) {
        result['$lte'] = maxValue;
      }
      
      return Object.keys(result).length > 0 ? result : null;
    }
    
    if (minCost) {
      const value = Number(minCost);
      
      if (!isNaN(value)) {
        return {
          $gte: value,
        };
      }
      
      return null;
    }
    
    if (maxCost) {
      const value = Number(maxCost);
      
      if (!isNaN(value)) {
        return {
          $lte: value,
        };
      }
      
      return null;
    }
    
    return null;
  }
}