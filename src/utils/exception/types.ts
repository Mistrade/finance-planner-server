import { TCategoriesExceptionCodes } from '../../modules/category/category.exception';
import { TProfileExceptionCodes } from '../../modules/profile/profile.exception';
import { TSessionExceptionCodes } from '../../modules/session/session.exception';
import { TTagsExceptionCodes } from '../../modules/tags/tags.exception';
import { TWalletsExceptionCodes } from '../../modules/wallets/wallets.exception';

export type TTargetsExceptionCodes = 'CANT_CREATE_TARGET' | 'NOT_FOUND_Target';

export interface IModuleExceptionBuilder<
  ModuleName extends string,
  Codes extends string,
> {
  moduleName: ModuleName;
  code: Codes;
}

export interface IExceptionFactoryModulesMap {
  tags: IModuleExceptionBuilder<'tags', TTagsExceptionCodes>;
  targets: IModuleExceptionBuilder<'targets', TTargetsExceptionCodes>;
  categories: IModuleExceptionBuilder<'categories', TCategoriesExceptionCodes>;
  profile: IModuleExceptionBuilder<'profile', TProfileExceptionCodes>;
  session: IModuleExceptionBuilder<'session', TSessionExceptionCodes>;
  wallets: IModuleExceptionBuilder<'wallets', TWalletsExceptionCodes>;
}

export type IExceptionFactoryModuleNames = keyof IExceptionFactoryModulesMap;
export type AnyModuleExceptionObject =
  IExceptionFactoryModulesMap[IExceptionFactoryModuleNames];
