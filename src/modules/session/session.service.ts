import { InjectRedis } from '@liaoliaots/nestjs-redis';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { compare } from 'bcryptjs';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import Redis from 'ioredis';
import { v4 } from 'uuid';
import { ExceptionFactory } from '../../utils/exception/exception.factory';
import { RejectException } from '../../utils/exception/reject.exception';
import { AnyModuleExceptionObject } from '../../utils/exception/types';
import { REDIS_NAMESPACES } from '../../utils/global.constants';
import { MetaService } from '../meta/meta.service';
import { IGetIpData } from '../meta/meta.types';
import { Timezone } from '../meta/models/timezone.model';
import { TProfileExceptionCodes } from '../profile/profile.exception';
import { Profile, TProfileDocument } from '../profile/profile.model';
import { ProfileService } from '../profile/profile.service';
import { SessionDto } from './dto/session.dto';
import { COOKIE_NAMES } from './session.constants';
import { generateSessionRedisToken } from './session.utils';
import { IAuthJwtPayload, SignInServiceMethodReturned } from './types/session.types';
import { ISessionData } from './utils/session.data';

@Injectable()
export class SessionService {
  constructor(
    private readonly configService: ConfigService,
    private readonly metaService: MetaService,
    @InjectRedis(REDIS_NAMESPACES.SESSION) private readonly redisService: Redis,
    private readonly profileService: ProfileService,
    private readonly jwtService: JwtService,
  ) {
  }
  
  async getActiveSessions(session: ISessionData): Promise<any> {
    const keys = await this.redisService.keys(generateSessionRedisToken(session.profile._id, null));
    console.log('Ключи активных сессий: ', keys);
    
    const res = await this.redisService.mget(keys);
    console.log('Активные сессии: ', res);
    
    return res.map((item) => JSON.parse(item));
  }
  
  async registerUser(dto: SessionDto): Promise<TProfileDocument | TProfileExceptionCodes> {
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
    request: Request,
    response: Response,
  ): Promise<SignInServiceMethodReturned | AnyModuleExceptionObject | RejectException> {
    //Проверяю наличие сессии у пользователя
    const session = await this.resolveOpenSession(request.cookies[COOKIE_NAMES.ACCESS_TOKEN], response);
    
    //Если сессия есть, то отправляю ошибку
    if (session) {
      return { moduleName: 'session', code: 'USER_HAS_SESSION' };
    }
    
    //Ищу пользователя по логину (емейл)
    const user: TProfileDocument | null = await this.profileService.findUserByLogin(dto.login);
    
    if (!user) {
      return { moduleName: 'profile', code: 'USER_NOT_FOUND' };
    }
    
    //Сравниваю пароли
    const validPassword = await compare(dto.password, user.passwordHash);
    
    //Если пароль не валидный, отправляю ошибку
    if (!validPassword) {
      return { moduleName: 'session', code: 'USER_INCORRECT_PASSWORD' };
    }
    
    const tokenPayload = this.buildJwtPayload(user);
    const newToken = this.generateSessionToken(tokenPayload);
    
    const sessionData: ISessionData | RejectException = await this.buildSessionData(user, {
      ip: request.ip,
      timezone: request.headers['timezone']?.toString(),
      userAgent: request.headers['user-agent'],
      uuid: tokenPayload.uuid,
    });
    
    if (sessionData instanceof RejectException) {
      return sessionData;
    }
    
    const redisKey = generateSessionRedisToken(sessionData.profile._id.toString(), sessionData.uuid);
    
    try {
      await this.redisService.set(redisKey, JSON.stringify(sessionData), 'EX', 30 * 24 * 60 * 60);
    } catch (e: any) {
      console.error('redis cant set session data', e);
      return { moduleName: 'session', code: 'USER_CANT_CREATE_SESSION' };
    }
    
    return {
      token: newToken,
      userInfo: user,
    };
  }
  
  async logout(token: string | null, res: Response) {
    if (!token) {
    }
  }
  
  private async buildSessionData(
    user: Profile,
    data: { timezone: string | null; ip: string; userAgent: string; uuid: string },
  ): Promise<ISessionData | RejectException> {
    const response: RejectException | [Timezone, IGetIpData] = await Promise.all([
      this.metaService.getTimezoneByZoneName(data.timezone),
      this.metaService.getInfoByIp(data.ip),
    ]).catch((reason) => {
      console.log(reason);
      return ExceptionFactory.create({ moduleName: 'session', code: 'USER_CANT_CREATE_SESSION' });
    });
    
    if (response instanceof RejectException) {
      return response;
    }
    
    const [timezoneDoc, ipDetail] = response;
    
    return {
      timezone: timezoneDoc,
      loginIpDetail: ipDetail,
      userAgent: data.userAgent,
      profile: user,
      timezoneSelectedByUser: false,
      uuid: data.uuid,
    };
  }
  
  private generateSessionToken(payload: Record<string, any>) {
    return this.jwtService.sign(payload, { secret: this.configService.get('JWT_SECRET_CODE') });
  }
  
  private buildJwtPayload(user: TProfileDocument): IAuthJwtPayload {
    return {
      userId: user._id.toString(),
      uuid: this.generateUuid(),
    };
  }
  
  private generateUuid() {
    return v4();
  }
  
  private async resolveOpenSession(token: string | null, response: Response): Promise<string | null> {
    if (!token) {
      return null;
    }
    
    this.removeTokenFromCookie(response);
    const payload: IAuthJwtPayload = this.jwtService.decode(token) as IAuthJwtPayload;
    const redisKey = generateSessionRedisToken(payload.userId, payload.uuid);
    
    return this.redisService.getdel(redisKey);
  }
  
  public removeTokenFromCookie(response: Response) {
    response.cookie(COOKIE_NAMES.ACCESS_TOKEN, '', { maxAge: 0 });
  }
  
  async setSessionDataToRedis(sessionData: ISessionData): Promise<any> {
    const redisKey = generateSessionRedisToken(sessionData.profile._id, sessionData.uuid);
    try {
      await this.redisService.set(redisKey, JSON.stringify(sessionData));
    } catch (e) {
      console.error(`Не удалось записать данные в сессию: ключ (${redisKey})`, e);
    }
  }
}
