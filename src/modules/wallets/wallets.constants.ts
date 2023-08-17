export const WALLET_NAME_MIN_LENGTH = 3;
export const WALLET_NAME_MAX_LENGTH = 32;

export enum WALLET_TYPE {
  DEBIT_CARD = 'debit_card',
  CREDIT_CARD = 'credit_card',
  MONEY = 'money',
}

export enum WALLET_CREATOR {
  USER = 'user',
  BASE = 'system_after_registration',
}

export enum WALLET_MESSAGES {
  BALANCE_SHOULD_BE_NUMBER = 'Баланс кошелька должен быть числом',
  NAME_SHOULD_BE_STRING = `Название кошелька должно быть строковым значением от ${WALLET_NAME_MIN_LENGTH} до ${WALLET_NAME_MAX_LENGTH} символов в длину.`,
  NAME_MIN_LENGTH = `Название кошелька должно быть не менее ${WALLET_NAME_MIN_LENGTH} символов в длину.`,
  NAME_MAX_LENGTH = `Название кошелька должно быть не более ${WALLET_NAME_MAX_LENGTH} символов в длину.`,
  TYPE_SHOULD_BE_ENUM = `Тип кошелька должен быть один из: Дебетовая Карта, Кредитная карта или Наличные.`,

  DB_NOT_FOUND = 'Запрашиваемый кошелек не найден',
  CANT_CREATE_BASE_WALLET = `Не удалось создать базовый набор кошельков, пожалуйста, попробуйте сделать это позже.`,
  CANT_CREATE_NEW_WALLET = `Не удалось создать новый кошелек, попробуйте снова.`,
  NOT_FOUND_OR_CANT_DELETE = `Запрашиваемый кошелек не найден или его нельзя удалять.`
}
