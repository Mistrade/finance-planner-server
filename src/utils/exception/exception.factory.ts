import { HttpException, HttpStatus } from "@nestjs/common";
import { CategoryException } from '../../modules/category/category.exception';
import { OPERATION_API_MESSAGES } from "../../modules/operations/operations.constants";
import { OperationException } from "../../modules/operations/operations.exception";
import { ProfileException } from '../../modules/profile/profile.exception';
import { SessionException } from '../../modules/session/session.exception';
import { TagsException } from '../../modules/tags/tags.exception';
import { WalletsException } from '../../modules/wallets/wallets.exception';
import { exhaustiveCheck, IResponseAdapterInfo } from "../exception.data";
import { RejectException } from "./reject.exception";
import { IExceptionFactoryModulesMap, TExceptionMeta } from "./types";

export abstract class ExceptionFactory {
  static create<
    ModuleName extends keyof IExceptionFactoryModulesMap,
    Module extends IExceptionFactoryModulesMap[ModuleName],
    Data,
  >(module: Module, data: Data = null, meta?: TExceptionMeta): HttpException {
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
      case 'operations':
        return OperationException.create(module, data);
    }

    exhaustiveCheck(module);
  }
  
  static createDefault<Data>(data: Data | null, meta?: TExceptionMeta){
    return new RejectException({
      data: data || null,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: `Произошла непредвиденная ошибка. Уже работаем над ее устранением!`,
      ...meta,
    })
  }
}
