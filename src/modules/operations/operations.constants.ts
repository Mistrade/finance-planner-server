export const OPERATION_TITLE_MIN_LENGTH = 3;
export const OPERATION_TITLE_MAX_LENGTH = 100;

export const OPERATION_DESCRIPTION_MAX_LENGTH = 300;
export const OPERATION_MAX_TAGS = 10;
export const OPERATION_MAX_CATEGORIES = 5;

export enum OPERATION_MODEL_MESSAGES {
  //title validate messages
  TITLE_MIN_LENGTH = `Название операции должно быть не менее ${OPERATION_TITLE_MIN_LENGTH} символов.`,
  TITLE_MAX_LENGTH = `Название операции должно быть не более ${OPERATION_TITLE_MAX_LENGTH} символов.`,
  TITLE_SHOULD_BE_STRING = `Название операции должно быть строковым значением от ${OPERATION_TITLE_MIN_LENGTH} до ${OPERATION_TITLE_MAX_LENGTH} символов.`,
  TITLE_IS_REQUIRED = `Название операции обязательно для заполнения`,
  
  //wallet validate messages
  DTO_WALLET_SHOULD_BE_STRING = `Невалидный идентификатор кошелька. Идентификатор кошелька должен быть строковым значением.`,
  WALLET_IS_REQUIRED = `Кошелек, за которым будет закреплена операция - обязателен для заполнения.`,
  
  //user validate messages
  USER_SHOULD_BE_OBJECT_ID = `Невалидный идентификатор пользователя-владельца операции.`,
  USER_IS_REQUIRED = `Не удалось установить пользователя-владельца операции.`,
  
  //description validate messages
  DESCRIPTION_MAX_LENGTH = `Описание операции должно быть не более ${OPERATION_DESCRIPTION_MAX_LENGTH} символов`,
  DESCRIPTION_SHOULD_BE_STRING = `Описание операции должно быть строковым значением.`,
  
  //cost validate messages
  COST_IS_REQUIRED = `Поле \"Стоимость операции\" обязательно для заполнения.`,
  COST_SHOULD_BE_NUMBER = `Поле \"Стоимость операции\" должно быть числом`,
  
  //type validate messages
  OPERATION_TYPE_IS_REQUIRED = `Поле \"Тип операции\" обязательно для заполнения`,
  OPERATION_TYPE_SHOULD_BE_ENUM = `Поле \"Тип операции\" принимает только определенные значения: Доход/Расход.`,
  
  //date validate messages
  DATE_IS_REQUIRED = `Поле \"Дата и время операции\" обязательно для заполнения.`,
  DATE_IS_INVALID = `Поле \"Дата и время операции\" содержит невалидное значение.`,
  
  //state validate messages
  STATE_IS_REQUIRED = `Поле \"Состояние операции\" обязательно для заполнения.`,
  STATE_IS_INVALID = `Поле \"Состояние операции\" содержит невалидное значение`,
  STATE_SHOULD_BE_ENUM = `Поле \"Состояние операции\" принимает только определенные значения: Запланировано/Реализовано.`,
  
  //repeat validate messages
  REPEAT_IS_REQUIRED = `Поле \"Повторяемая операция\" обязательно для заполнения.`,
  REPEAT_IS_INVALID = `Поле \"Повторяемая операция\" содержит невалидное значение.`,
  
  //repeatPattern validate messages
  REPEAT_PATTERN_IS_INVALID = `Поле \"Правило повторения операции\" содержит невалидное значение`,
  
  //endRepeatDate validate messages
  END_REPEAT_DATE_IS_INVALID = `Поле \"Дата последнего повторения\" содержит невалидную дату.`,
  
  //target validate messages
  TARGET_IS_INVALID = `Поле \"Цель\" имеет невалидное значение`,
  
  //category validate messages
  CATEGORY_SHOULD_BE_ARRAY = `Поле \"Категории\" должно содержать список категорий.`,
  CATEGORY_MAX_LENGTH = `Поле \"Категории\" может содержать не более ${OPERATION_MAX_TAGS} элементов.`,
  
  //tags validate messages
  TAGS_SHOULD_BE_ARRAY = `Поле \"Теги\" должно содержать список тегов.`,
  TAGS_MAX_LENGTH = `Поле \"Теги\" может содержать не более ${OPERATION_MAX_TAGS} элементов.`
}

export enum OPERATION_API_MESSAGES {
  NOTHING_TO_REMOVE = `Не удалось найти операцию для удаления.`,
  NOT_FOUND = `Не удалось найти операцию.`,
  PREV_EQUAL_WITH_NEXT = `Обновление данных отклонено: Предыдущее значение совпадает с новым.`,
  DEFAULT = `Произошла непредвиденная ошибка. Уже работаем над ее устранением!`,
  UNDEFINED_UPDATE_PROPERTY = `Неизвестный ключ для обновления данных по операции.`,
  INVALID_DATE = `Получена невалидная дата.`,
  INVALID_DTO = `Получены невалидные даты для запроса.`
}

export enum OPERATION_STATE {
  PLANNING = 'planning',
  REALISE = 'realise',
}

export enum OPERATION_REPEAT_PATTERNS {
  EVERY_DAY = 'every_day',
  EVERY_WEEKDAY = 'every_weekday',
  EVERY_WEEK = 'every_week',
  EVERY_TWO_WEEK = 'every_two_week',
  EVERY_MONTH = 'every_month',
  EVERY_TWO_MONTH = 'every_two_month',
  EVERY_THREE_MONTH = 'every_three_month',
  EVERY_SIX_MONTH = 'every_six_month',
  EVERY_YEAR = 'every_year',
}

export enum OPERATION_TYPES {
  CONSUMPTION = 'consumption',
  INCOME = 'income',
}

export type TDefaultOperationCountMap = {
  [key in OPERATION_REPEAT_PATTERNS]: number;
};

export const DEFAULT_REPEAT_OPERATION_COUNT_MAP: TDefaultOperationCountMap = {
  every_day: 30,
  every_weekday: 60,
  every_week: 12,
  every_two_week: 12,
  every_month: 12,
  every_two_month: 6,
  every_three_month: 4,
  every_six_month: 4,
  every_year: 3,
};