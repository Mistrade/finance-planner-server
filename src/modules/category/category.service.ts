import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { TUserDocument } from '../profile/db_models/user.model';
import { Category, TCategoryDocument, TCategoryModel } from './category.model';
import { CreateCategoryDto } from './dto/create.category.dto';

@Injectable()
export class CategoryService {
  constructor(
    @InjectModel(Category.name) private readonly categoryModel: TCategoryModel,
  ) {}

  async createCategory(
    data: CreateCategoryDto,
    userInfo: TUserDocument,
  ): Promise<TCategoryDocument | null> {
    const prev: TCategoryDocument | null = await this.findCategoryByName(
      data.name,
      userInfo._id,
    );

    if (prev?._id) {
      return null;
    }

    return new this.categoryModel({
      name: data.name,
      user: userInfo._id,
    }).save();
  }

  async removeCategory(
    categoryId: Types.ObjectId,
    userInfo: TUserDocument,
  ): Promise<TCategoryDocument | null> {
    const removeResult = await this.categoryModel.findOneAndRemove({
      user: userInfo._id,
      _id: categoryId._id,
    });

    if (!removeResult?._id) {
      return null;
    }

    return removeResult;
  }

  async getAllCategoriesByUserId(
    userId: Types.ObjectId,
  ): Promise<Array<TCategoryDocument>> {
    return this.categoryModel.find({
      user: userId._id,
    });
  }

  async findCategoryById(
    categoryId: Types.ObjectId,
    userId: Types.ObjectId,
  ): Promise<TCategoryDocument | null> {
    return this.categoryModel.findOne({
      user: userId._id,
      _id: categoryId._id,
    });
  }

  async findCategoryByName(
    name: string,
    userId: Types.ObjectId,
  ): Promise<TCategoryDocument | null> {
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
    const prev: TCategoryDocument | null = await this.findCategoryByName(
      dto.name,
      userId,
    );

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
