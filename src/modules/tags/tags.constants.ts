export const TAG_TITLE_MIN_LENGTH = 3;
export const TAG_TITLE_MAX_LENGTH = 32;

export enum TAG_MESSAGES {
  TITLE_SHOULD_BE_STRING = `Заголовок тега должен быть строковым значением, от ${TAG_TITLE_MIN_LENGTH} до ${TAG_TITLE_MAX_LENGTH} символов`,
  TITLE_MIN_LENGTH = `Заголовок тега должен быть в длину не менее ${TAG_TITLE_MIN_LENGTH} символов`,
  TITLE_MAX_LENGTH = `Заголовок тега должен быть в длину не более ${TAG_TITLE_MAX_LENGTH} символов`,

  CANT_CREATED = `Не удалось создать тег`,
  CANT_REMOVED = `Не удалось удалит тег. Тег не найден или произошла непредвиденная ошибка.`,
  TAG_NOT_FOUND = `Запрашиваемый тег не найден у текущего пользователя`,
  NOT_REMOVED = 'Ничего не удалено',
  NOTHING_TO_REMOVE = 'Некорректный запрос. Нечего удалять.',
  UPDATE_TAG_TITLE_ALREADY_EXISTS = `Не удалось обновить название тега, так как у вас уже есть тег с таким названием.`,
  SUCCESS_REMOVED = `Тег успешно удален`,
  SUCCESS_UPDATED = `Тег был успешно изменен`,
  SUCCESS_CREATED = `Тег был успешно создан`,
}
