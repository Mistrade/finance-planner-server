/**
 * @param data
 * Если пользователь указал на запоминание текущего устройства, то сессия создает на 30 дней.
 * Иначе на 6 часов.
 */
export function getSessionDataTTL(saveThisDevice?: boolean): number {
  if(saveThisDevice) {
    return 30 * 24 * 60 * 60;
    // 30 дней
  }
  
  // 6 часов
  return 6 * 60 * 60;
}
