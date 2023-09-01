export const PASSWORD_MIN_LENGTH_COUNT = 6;
export const PASSWORD_MAX_LENGTH_COUNT = 30;
export const LOGIN_MIN_LENGTH_COUNT = 6;
export const LOGIN_MAX_LENGTH_COUNT = 50;

export enum SESSION_MESSAGES {
  PASSWORD_SHOULD_BE_STRING = `Пароль должен быть строковым значением`,
  PASSWORD_MIN_LENGTH = `Пароль пользователя должен быть не менее ${PASSWORD_MIN_LENGTH_COUNT} символов`,
  PASSWORD_MAX_LENGTH = `Пароль пользователя должен быть не более ${PASSWORD_MAX_LENGTH_COUNT} символов`,

  LOGIN_SHOULD_BE_STRING = `Логин пользователя должен быть строковым значением`,
  LOGIN_MIN_LENGTH = `Логин пользователя должен быть не менее ${LOGIN_MIN_LENGTH_COUNT} символов`,
  LOGIN_MAX_LENGTH = `Логин пользователя должен быть не более ${LOGIN_MAX_LENGTH_COUNT} символов`,
  LOGIN_SHOULD_BE_EMAIL = 'Логин пользователя должен быть валидным email-адресом',

  USER_SUCCESSFULLY_CREATED = 'Пользователь был успешно создан',
  USER_INCORRECT_PASSWORD = 'Неверный логин или пароль от учетной записи пользователя',
  USER_HAS_SESSION = `У данного пользователя уже есть активная сессия`,
  USER_CANT_CREATE_SESSION = 'Не удалось создать сессию для указанного пользователя. Пожалуйста, повторите попытку.',
  USER_SUCCESS_LOGIN = 'Пользователь был успешно авторизован',
  USER_NOT_AUTHORIZED = 'Пользователь не авторизован, для выполнения данного запроса',
  USER_NOT_FOUND_SESSION = 'Сессия пользователя не найдена',
  USER_CANT_CHECK_SESSION = 'Не удалось проверить сессию пользователя',

  REG_CANT_CREATE_BASE_WALLETS = `Пользователь успешно зарегистрирован, но создать стартовый набор кошельков не удалось.`,
  ACCOUNT_HACKING_ATTEMPT = `Произошла попытка взлома аккаунта, пожалуйста поменяйте пароль.`
}

export enum CUSTOM_SESSION_STATUS_CODES {
  ACCOUNT_HACKING_ATTEMPT = 1000,
}

export enum COOKIE_NAMES {
  ACCESS_TOKEN = 'accessToken',
}
