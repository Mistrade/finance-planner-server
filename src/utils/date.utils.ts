import dayjs from 'dayjs';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';

export const setupDayjsPlugins = () => {
  dayjs.extend(utc);
  dayjs.extend(updateLocale);
  dayjs.updateLocale('en', {
    weekStart: 1,
    yearStart: 4,
  });
};
