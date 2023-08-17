import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { ExceptionFactory } from '../../utils/exception/exception.factory';
import { TUserDocument } from '../profile/db_models/user.model';
import { AuthRequest } from './session.guard';

export const GetCookies = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return data ? request.cookies?.[data] || null : null;
  },
);

export const UserInfo = createParamDecorator(
  (data: void, ctx: ExecutionContext): TUserDocument => {
    const request = ctx.switchToHttp().getRequest<AuthRequest>();

    if (!request.user) {
      throw ExceptionFactory.create(
        { moduleName: 'session', code: 'USER_NOT_AUTHORIZED' },
        null,
      );
    }

    return request.user;
  },
);
