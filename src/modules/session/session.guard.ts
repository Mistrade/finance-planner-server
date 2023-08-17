import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Cache } from 'cache-manager';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { ExceptionFactory } from '../../utils/exception/exception.factory';
import {
  TUserDocument,
  TUserModel,
  User,
} from '../profile/db_models/user.model';
import { ProfileService } from '../profile/profile.service';
import { COOKIE_NAMES } from './session.constants';
import { SessionService } from './session.service';
import { IAuthJwtPayload } from './types/session.types';

export interface AuthRequest extends Request {
  user: TUserDocument;
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    @InjectModel(User.name) private readonly userModel: TUserModel,
    @Inject(CACHE_MANAGER) private readonly cacheService: Cache,
    private readonly jwtService: JwtService,
    private readonly profileService: ProfileService,
    private readonly sessionService: SessionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const response = http.getResponse();
    const request = http.getRequest();

    const token = this.extractAccessTokenFromCookies(request);
    const authData = await this.checkValidTokenAndGetAuthData(token, response);

    await this.findAndSetUserToReqContext(authData, request);

    return true;
  }

  private async findAndSetUserToReqContext(
    jwtPayload: IAuthJwtPayload,
    request: Request,
  ) {
    const user = await this.profileService.findUserById(
      new Types.ObjectId(jwtPayload.userId),
    );

    if (!user) {
      throw ExceptionFactory.create(
        { moduleName: 'profile', code: 'USER_NOT_FOUND' },
        null,
      );
    }

    request['user'] = user;
  }

  private extractAccessTokenFromCookies(req: Request): string | null {
    return req.cookies[COOKIE_NAMES.ACCESS_TOKEN] || null;
  }

  private async checkValidTokenAndGetAuthData(
    token: string | null,
    response: Response,
  ): Promise<IAuthJwtPayload> {
    if (!token) {
      throw ExceptionFactory.create(
        { moduleName: 'session', code: 'USER_NOT_AUTHORIZED' },
        null,
      );
    }

    const sessionToken: string = await this.cacheService.get(token);

    if (!sessionToken) {
      this.sessionService.removeTokenFromCookie(response);
      throw ExceptionFactory.create(
        { moduleName: 'session', code: 'NOT_FOUND_SESSION' },
        null,
      );
    }

    const userInfo: IAuthJwtPayload = this.jwtService.decode(
      sessionToken,
    ) as IAuthJwtPayload;

    if (!userInfo?.userId) {
      throw ExceptionFactory.create(
        { moduleName: 'session', code: 'USER_CANT_CHECK_SESSION' },
        null,
      );
    }

    return userInfo;
  }
}
