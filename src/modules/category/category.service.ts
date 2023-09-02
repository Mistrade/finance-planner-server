import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TProfileDocument } from '../profile/profile.model';
import { ResolveService } from '../resolve/resolve.service';
import { Category, TCategoryDocument, TCategoryModel } from './category.model';
import { CreateCategoryDto } from './dto/create.category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: TCategoryModel,
    private readonly resolveService: ResolveService,
  ) {}

  async resolveStringCategories(arr: Array<string>, userId: Types.ObjectId) {
    const { valid, inValid } = this.resolveService.resolveMongooseObjectIds(arr);

    let validIds: Array<Types.ObjectId> = [];

    if (valid.length) {
      const validResult: Array<TCategoryDocument> = await this.categoryModel.find({
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

    const createdCategories = await this.createManyCategories(
      inValid.map((item) => ({ name: item })),
      userId,
    );

    return [...createdCategories.map((item) => item._id), ...validIds];
  }

  async createManyCategories(
    data: Array<CreateCategoryDto>,
    userId: Types.ObjectId,
  ): Promise<Array<TCategoryDocument>> {
    if (!data.length) {
      return [];
    }

    let documents: Array<Pick<Category, 'name' | 'user'>> = data.map((item) => ({
      name: item.name,
      user: userId,
    }));

    const alreadyExists = await this.categoryModel.find({
      name: {
        $in: documents.map((item) => new RegExp(item.name, 'i')),
      },
      user: userId,
    });

    if (alreadyExists.length) {
      alreadyExists.forEach((alreadyItem) => {
        documents = documents.filter((item) => {
          //TODO AND TAGS доработать на match
          return !new RegExp(alreadyItem.name, 'i').test(item.name);
        });
      });
    }

    console.log('_____CATEGORY FOR CREATE____');
    console.log(documents);

    const createdCategories = await this.categoryModel.insertMany(documents);

    return [...createdCategories, ...alreadyExists];
  }

  async createCategory(data: CreateCategoryDto, userInfo: TProfileDocument): Promise<TCategoryDocument | null> {
    const prev: TCategoryDocument | null = await this.findCategoryByName(data.name, userInfo._id);

    if (prev?._id) {
      return null;
    }

    return new this.categoryModel({
      name: data.name,
      user: userInfo._id,
    }).save();
  }

  async removeCategory(categoryId: Types.ObjectId, userInfo: TProfileDocument): Promise<TCategoryDocument | null> {
    const removeResult = await this.categoryModel.findOneAndRemove({
      user: userInfo._id,
      _id: categoryId._id,
    });

    if (!removeResult?._id) {
      return null;
    }

    return removeResult;
  }

  async getAllCategoriesByUserId(userId: Types.ObjectId): Promise<Array<TCategoryDocument>> {
    return this.categoryModel.find({
      user: userId._id,
    });
  }

  async findCategoryById(categoryId: Types.ObjectId, userId: Types.ObjectId): Promise<TCategoryDocument | null> {
    return this.categoryModel.findOne({
      user: userId._id,
      _id: categoryId._id,
    });
  }

  async findCategoryByName(name: string, userId: Types.ObjectId): Promise<TCategoryDocument | null> {
    return this.categoryModel.findOne({
      user: userId,
      name: {
        $regex: name,
        $options: 'i',
      },
    });
  }

  async updateCategoryData(
    dto: CreateCategoryDto,
    categoryId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<TCategoryDocument | null> {
    const prev: TCategoryDocument | null = await this.findCategoryByName(dto.name, userId);

    if (prev?._id) {
      return null;
    }

    const category = await this.categoryModel.findOne({
      _id: categoryId,
      user: userId,
    });

    category.name = dto.name;

    return category.save();
  }
}
