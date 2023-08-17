import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

export const setupDayjsPlugins = () => {
  dayjs.extend(utc);
};
