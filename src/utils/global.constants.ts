export const DEFAULT_REJECT_MESSAGE =
  'Не удалось выполнить операцию. Возможно произошла непредвиденная ошибка.';


export enum REDIS_NAMESPACES {
  SESSION = 'default',
  WALLET_STATE = 'wallet_state',
}

export enum CONTROLLER_PATHS {
  OPERATIONS = 'operations',
  META = 'meta'
}
