import { TProfileDocument } from '../../profile/profile.model';

export interface IAuthJwtPayload {
  userId: string;
  uuid: string;
}

export interface SignInServiceMethodReturned {
  token: string;
  userInfo: TProfileDocument;
}
