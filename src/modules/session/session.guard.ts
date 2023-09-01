import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Request, Response } from 'express';
import Redis from 'ioredis';
import { Types } from 'mongoose';
import { ExceptionFactory } from '../../utils/exception/exception.factory';
import { REDIS_NAMESPACES } from '../../utils/global.constants';
import { MetaService } from '../meta/meta.service';
import { Timezone } from '../meta/models/timezone.model';
import { Profile, TProfileDocument, TProfileModel } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { COOKIE_NAMES } from './session.constants';
import { SessionService } from './session.service';
import { generateSessionRedisToken } from './session.utils';
import { IAuthJwtPayload } from './types/session.types';
import { ISessionData } from './utils/session.data';

export interface AuthRequest extends Request {
  user: TProfileDocument;
  headers: Request['headers'] & {
    timezone?: string;
  };
  sessionData: ISessionData;
}

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(
    @InjectModel(Profile.name) private readonly userModel: TProfileModel,
    @InjectRedis(REDIS_NAMESPACES.SESSION) private readonly redisService: Redis,
    private readonly jwtService: JwtService,
    private readonly profileService: ProfileService,
    private readonly sessionService: SessionService,
    private readonly metaService: MetaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const http = context.switchToHttp();
    const response = http.getResponse();
    const request = http.getRequest();

    const token = this.extractAccessTokenFromCookies(request);
    const sessionData = await this.resolveSessionData(
      await this.checkTokenReturnSessionData(token, response),
      request,
      response,
    );
    await this.validateSessionDataByUserId(sessionData, request);

    return true;
  }

  private async validateSessionDataByUserId(sessionData: ISessionData, request: Request) {
    const user = await this.profileService.findUserById(new Types.ObjectId(sessionData.profile._id));

    if (!user) {
      throw ExceptionFactory.create({ moduleName: 'profile', code: 'USER_NOT_FOUND' }, null);
    }

    request['user'] = user;
    request['sessionData'] = sessionData;
  }

  private extractAccessTokenFromCookies(req: Request): string | null {
    return req.cookies[COOKIE_NAMES.ACCESS_TOKEN] || null;
  }

  private async resolveSessionUserAgent(sessionData: ISessionData, req: Request, res: Response) {
    const reqUserAgent = req.headers['user-agent'];
    if (sessionData.userAgent === reqUserAgent) return;

    const token = this.extractAccessTokenFromCookies(req);
    await this.sessionService.logout(token, res);
    //TODO добавить отправку сообщения о попытке взлома аккаунта, запрашивать смену пароля.

    throw ExceptionFactory.create({ moduleName: 'session', code: 'ACCOUNT_HACKING_ATTEMPT' }, null);
  }

  private async resolveSessionTimezone(
    sessionData: ISessionData,
    reqTimeZone: string | null,
  ): Promise<Timezone | null> {
    if (!reqTimeZone) {
      return sessionData.timezone;
    }

    if (!sessionData.timezone) {
      return this.metaService.getTimezoneByZoneName(reqTimeZone);
    }

    if (sessionData.timezoneSelectedByUser) {
      return sessionData.timezone;
    }

    if (reqTimeZone !== sessionData.timezone.zoneName) {
      const newZone = await this.metaService.getTimezoneByZoneName(reqTimeZone);
      return newZone || sessionData.timezone;
    }

    return sessionData.timezone;
  }

  private async resolveSessionData(sessionData: ISessionData, req: Request, res: Response): Promise<ISessionData> {
    await this.resolveSessionUserAgent(sessionData, req, res);
    
    const requestTimezone = req.headers['timezone'] as string;
    const newTimeZone = await this.resolveSessionTimezone(sessionData, requestTimezone ?? null);

    if (newTimeZone?._id && newTimeZone._id.toString() !== sessionData.timezone._id.toString()) {
      sessionData.timezone = newTimeZone;

      setTimeout(() => {
        this.sessionService.setSessionDataToRedis(sessionData);
      });
    }


    return sessionData;
  }

  private async checkTokenReturnSessionData(token: string | null, response: Response): Promise<ISessionData> {
    if (!token) {
      throw ExceptionFactory.create({ moduleName: 'session', code: 'USER_NOT_AUTHORIZED' }, null);
    }

    const jwtPayload: IAuthJwtPayload = this.jwtService.decode(token) as IAuthJwtPayload;
    const redisToken = generateSessionRedisToken(jwtPayload.userId, jwtPayload.uuid);
    const sessionToken: string = await this.redisService.get(redisToken);

    if (!sessionToken) {
      this.sessionService.removeTokenFromCookie(response);
      throw ExceptionFactory.create({ moduleName: 'session', code: 'NOT_FOUND_SESSION' }, null);
    }

    const sessionData: ISessionData = JSON.parse(sessionToken) as ISessionData;

    if (!sessionData?.profile?._id) {
      throw ExceptionFactory.create({ moduleName: 'session', code: 'USER_CANT_CHECK_SESSION' }, null);
    }

    return sessionData;
  }
}
