import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { SessionDto } from '../session/dto/session.dto';
import { TUserDocument, TUserModel, User } from './db_models/user.model';
import { HASH_PASSWORD_SALT_VALUE } from './profile.constants';
import { TProfileExceptionCodes } from './profile.exception';

@Injectable()
export class ProfileService {
  constructor(@InjectModel(User.name) private readonly userModel: TUserModel) {}

  async findUserByLogin(login: string): Promise<TUserDocument | null> {
    return this.userModel
      .findOne({
        email: login,
      })
      .exec();
  }

  async findUserById(userId: Types.ObjectId): Promise<TUserDocument | null> {
    const user: TUserDocument | null = await this.userModel.findById(userId);

    return user;
  }

  async createNewUser(
    dto: SessionDto,
  ): Promise<TUserDocument | TProfileExceptionCodes> {
    const candidate = await this.userModel.findOne({
      email: dto.login,
    });

    if (candidate) {
      return 'USER_ALREADY_EXISTS';
    }

    const passwordHash = await bcrypt.hash(
      dto.password,
      HASH_PASSWORD_SALT_VALUE,
    );

    return new this.userModel({
      email: dto.login,
      passwordHash,
    }).save();
  }
}
