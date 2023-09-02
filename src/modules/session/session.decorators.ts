import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExceptionFactory } from '../../utils/exception/exception.factory';
import { TProfileDocument } from '../profile/profile.model';
import { AuthRequest } from './session.guard';
import { ISessionData } from "./utils/session.data";

export const GetCookies = createParamDecorator((data: string, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  return data ? request.cookies?.[data] || null : null;
});

export const UserInfo = createParamDecorator((data: void, ctx: ExecutionContext): TProfileDocument => {
  const request = ctx.switchToHttp().getRequest<AuthRequest>();

  if (!request.user) {
    throw ExceptionFactory.create({ moduleName: 'session', code: 'USER_NOT_AUTHORIZED' }, null);
  }

  return request.user;
});

export const UserSession = createParamDecorator((data: void, ctx: ExecutionContext): ISessionData => {
  const request = ctx.switchToHttp().getRequest<AuthRequest>();

  if (!request.sessionData) {
    throw ExceptionFactory.create({ moduleName: 'session', code: 'USER_NOT_AUTHORIZED' }, null);
  }

  return request.sessionData;
});
