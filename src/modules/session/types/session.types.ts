import { TUserDocument } from '../../profile/db_models/user.model';

export interface IAuthJwtPayload {
  userId: string;
}

export interface SignInServiceMethodReturned {
  token: string;
  userInfo: TUserDocument;
}
