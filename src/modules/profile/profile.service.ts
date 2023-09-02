import { HttpService } from "@nestjs/axios";
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';
import dayjs from "dayjs";
import { Request } from "express";
import { Types } from 'mongoose';
import { MetaService } from "../meta/meta.service";
import { SessionDto } from '../session/dto/session.dto';
import { AuthRequest } from "../session/session.guard";
import { TProfileDocument, TProfileModel, Profile } from './profile.model';
import { HASH_PASSWORD_SALT_VALUE, SYSTEM_ROOTS } from "./profile.constants";
import { TProfileExceptionCodes } from './profile.exception';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name) private readonly userModel: TProfileModel,
    private readonly httpService: HttpService,
    private readonly ipService: MetaService,
  ) {}

  async findUserByLogin(login: string): Promise<TProfileDocument | null> {
    return this.userModel
      .findOne({
        email: login,
      })
      .exec();
  }

  async findUserById(userId: Types.ObjectId): Promise<TProfileDocument | null> {
    const user: TProfileDocument | null = await this.userModel.findById(userId);

    return user;
  }

  async createNewUser(dto: SessionDto): Promise<TProfileDocument | TProfileExceptionCodes> {
    const candidate = await this.userModel.findOne({
      email: dto.login,
    });

    if (candidate) {
      return 'USER_ALREADY_EXISTS';
    }

    const passwordHash = await bcrypt.hash(dto.password, HASH_PASSWORD_SALT_VALUE);
    // const ipInfo = await this.ipService.getInfoByIp();
    
    
    return new this.userModel({
      email: dto.login,
      passwordHash,
      systemRoot: SYSTEM_ROOTS.CLIENT,
      subscribe: null,
      defaultIpInfo: null,
    }).save();
  }
}
