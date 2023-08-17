import { HttpException } from '@nestjs/common';
import { CategoryException } from '../../modules/category/category.exception';
import { ProfileException } from '../../modules/profile/profile.exception';
import { SessionException } from '../../modules/session/session.exception';
import { TagsException } from '../../modules/tags/tags.exception';
import { WalletsException } from '../../modules/wallets/wallets.exception';
import { exhaustiveCheck } from '../exception.data';
import { IExceptionFactoryModulesMap } from './types';

export abstract class ExceptionFactory {
  static create<
    ModuleName extends keyof IExceptionFactoryModulesMap,
    Module extends IExceptionFactoryModulesMap[ModuleName],
    Data,
  >(module: Module, data: Data = null): HttpException {
    switch (module.moduleName) {
      case 'tags':
        return TagsException.create(module, data);
      case 'targets':
        return new HttpException({}, 1);
      case 'categories':
        return CategoryException.create(module, data);
      case 'profile':
        return ProfileException.create(module, data);
      case 'session':
        return SessionException.create(module, data);
      case 'wallets':
        return WalletsException.create(module, data);
    }

    exhaustiveCheck(module);
  }
}
