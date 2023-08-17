import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import { Cache } from 'cache-manager';
import dayjs from 'dayjs';
import { Response } from 'express';
import * as process from 'process';
import { v4 } from 'uuid';
import { AnyModuleExceptionObject } from '../../utils/exception/types';
import { TUserDocument } from '../profile/db_models/user.model';
import { TProfileExceptionCodes } from '../profile/profile.exception';
import { ProfileService } from '../profile/profile.service';
import { SessionDto } from './dto/session.dto';
import { COOKIE_NAMES } from './session.constants';
import {
  IAuthJwtPayload,
  SignInServiceMethodReturned,
} from './types/session.types';

@Injectable()
export class SessionService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) {}

  async registerUser(
    dto: SessionDto,
  ): Promise<TUserDocument | TProfileExceptionCodes> {
    return await this.profileService.createNewUser(dto);
  }

  setSessionTokenToResponse(token: string, res: Response) {
    res.cookie(COOKIE_NAMES.ACCESS_TOKEN, token, {
      httpOnly: true,
      expires: dayjs().utc().add(30, 'day').toDate(),
    });
  }

  async signInUser(
    dto: SessionDto,
    accessToken: string | null,
  ): Promise<SignInServiceMethodReturned | AnyModuleExceptionObject> {
    //Проверяю наличие сессии у пользователя
    const session = await this.getUserSession(accessToken);

    //Если сессия есть, то отправляю ошибку
    if (session) {
      return { moduleName: 'session', code: 'USER_HAS_SESSION' };
    }

    //Ищу пользователя по логину (емейл)
    const user: TUserDocument | null =
      await this.profileService.findUserByLogin(dto.login);

    if (!user) {
      return { moduleName: 'profile', code: 'USER_NOT_FOUND' };
    }

    //Сравниваю пароли
    const validPassword = await compare(dto.password, user.passwordHash);

    //Если пароль не валидный, отправляю ошибку
    if (!validPassword) {
      return { moduleName: 'session', code: 'USER_INCORRECT_PASSWORD' };
    }

    const newToken = this.generateSessionToken(user);
    const uuid = this.generateUuid();

    try {
      await this.cacheService.set(uuid, newToken, 30 * 24 * 60 * 60);
    } catch (e: any) {
      return { moduleName: 'session', code: 'USER_CANT_CREATE_SESSION' };
    }

    return {
      token: uuid,
      userInfo: user,
    };
  }

  async logout(token: string | null) {
    if (!token) {
    }
  }

  private generateSessionToken(user: TUserDocument) {
    return this.jwtService.sign(this.buildJwtPayload(user), {
      secret: process.env.JWT_SECRET_CODE,
    });
  }

  private buildJwtPayload(user: TUserDocument): IAuthJwtPayload {
    return {
      userId: user._id.toString(),
    };
  }

  private generateUuid() {
    return v4();
  }

  private async getUserSession(tokenId: string | null): Promise<string | null> {
    if (typeof tokenId !== 'string') {
      return null;
    }

    return this.cacheService.get(tokenId);
  }

  public removeTokenFromCookie(response: Response) {
    response.cookie(COOKIE_NAMES.ACCESS_TOKEN, '', { maxAge: 0 });
  }
}
