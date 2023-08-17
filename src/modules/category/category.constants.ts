export const CATEGORY_NAME_MAX_LENGTH = 32;
export const CATEGORY_NAME_MIN_LENGTH = 3;

export enum CATEGORY_MESSAGES {
  NAME_MAX_LENGTH = `Длина названия категории должна быть не более ${CATEGORY_NAME_MAX_LENGTH} символов`,
  NAME_MIN_LENGTH = `Длина названия категории должна быть не менее ${CATEGORY_NAME_MIN_LENGTH} символов`,
  NAME_IS_STRING = `Название категории должно быть строковым значением`,

  ALREADY_EXISTS = `Такая категория уже существует`,
  CANT_FIND_FOR_REMOVE = `Категория у данного пользователя не найдена`,
  SUCCESS_REMOVED = `Категория успешно удалена`,
  SUCCESS_UPDATED = `Категория успешно обновлена`,
  SUCCESS_CREATED = `Категория успешно создана`,
  NOT_FOUND_BY_ID = `Запрашиваемая категория не найдена`,
  NOT_FOUND_LIST = `Запрашиваемый список категорий не удалось найти.`,
  NOT_REMOVED = 'Не удалось удалить категорию, так как она не найдена или не принадлежит вам',
}
