import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Types } from 'mongoose';
import { IExceptionFactoryModulesMap } from '../../utils/exception/types';
import { ResolveService } from '../resolve/resolve.service';
import { CreateTagDto } from './dto/create.tag.dto';
import { Tag, TTagDocument, TTagModel } from './tags.model';

export type TagsServiceExceptionCodes = IExceptionFactoryModulesMap['tags']['code'];

@Injectable()
export class TagsService {
  constructor(
    @InjectModel(Tag.name) private readonly tagModel: TTagModel,
    private readonly resolveService: ResolveService,
  ) {}

  async resolveStringTags(arr: Array<string>, userId: Types.ObjectId): Promise<Array<Types.ObjectId>> {
    const { valid, inValid } = this.resolveService.resolveMongooseObjectIds(arr);
  
    let validIds: Array<Types.ObjectId> = [];
  
    if (valid.length) {
      const validResult: Array<TTagDocument> = await this.tagModel.find({
        _id: {
          $in: valid,
        },
        user: userId,
      });
    
      validIds = Array.isArray(validResult) ? validResult.map((item) => item._id) : [];
    }
    
    if (!inValid.length) {
      return validIds;
    }

    const createdCategories = await this.createManyTags(
      inValid.map((item) => ({ title: item })),
      userId,
    );

    return [...createdCategories.map((item) => item._id), ...validIds];
  }

  async createTag(dto: CreateTagDto, userId: Types.ObjectId): Promise<TTagDocument | null> {
    const tag = new this.tagModel({
      title: dto.title,
      user: userId,
    });

    return tag.save();
  }

  async createManyTags(data: Array<CreateTagDto>, userId: Types.ObjectId): Promise<Array<TTagDocument>> {
    if (!data.length) {
      return [];
    }

    let documents: Array<Pick<Tag, 'title' | 'user'>> = data.map((item) => ({
      title: item.title,
      user: userId,
    }));
    
    const alreadyExistsTags = await this.tagModel.find({
      title: {
        $in: documents.map((item) => new RegExp(item.title, 'i')),
      },
      user: userId,
    });

    if (alreadyExistsTags.length) {
      alreadyExistsTags.forEach((alreadyItem) => {
        documents = documents.filter((item) => {
          return !new RegExp(alreadyItem.title, 'i').test(item.title);
        });
      });
    }

    const createdTags = await this.tagModel.insertMany(documents);
    
    return [
      ...createdTags,
      ...alreadyExistsTags,
    ]
  }

  async findTagById(tagId: Types.ObjectId, userId: Types.ObjectId): Promise<TTagDocument | null> {
    return this.tagModel.findOne({
      _id: tagId,
      user: userId,
    });
  }

  async findTagsByUserId(userId: Types.ObjectId): Promise<Array<TTagDocument>> {
    return this.tagModel.find({
      user: userId,
    });
  }

  async findTagByTitle(
    title: string,
    userId: Types.ObjectId,
  ): Promise<TTagDocument | null | TagsServiceExceptionCodes> {
    return this.tagModel.findOne({
      title: {
        $regex: title,
        $options: 'i',
      },
      user: userId,
    });
  }

  async updateTagInfo(
    dto: CreateTagDto,
    userId: Types.ObjectId,
    tagId: Types.ObjectId,
  ): Promise<TTagDocument | TagsServiceExceptionCodes | null> {
    const prevTagInfo: TTagDocument | null = await this.tagModel.findOne({
      user: userId,
      _id: tagId,
    });

    if (!prevTagInfo) {
      return 'NOT_FOUND';
    }

    const candidate = await this.findTagByTitle(dto.title, userId);

    if (candidate) {
      return 'UPDATE_IMPOSSIBLE_TITLE_IS_ALREADY_EXISTS';
    }

    prevTagInfo.title = dto.title;

    return prevTagInfo.save();
  }

  async removeTag(tagId: Types.ObjectId, userId: Types.ObjectId): Promise<TTagDocument | null> {
    return this.tagModel.findOneAndRemove({
      user: userId,
      _id: tagId,
    });
  }

  async removeManyTags(
    tagIds: Array<Types.ObjectId>,
    userId: Types.ObjectId,
  ): Promise<mongoose.mongo.DeleteResult | TagsServiceExceptionCodes> {
    if (tagIds.length === 0) {
      return 'NOTHING_TO_REMOVE';
    }

    const result = await this.tagModel.deleteMany({
      _id: {
        $in: tagIds,
      },
      userId: userId,
    });

    if (result.deletedCount === 0) {
      return 'NOT_REMOVED';
    }

    return result;
  }
}
