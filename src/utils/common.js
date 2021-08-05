import dayjs from 'dayjs';

export const getDuration = (start, end) => {
  const diffInMinutes = (dayjs(end)).diff(dayjs(start), 'minutes');
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes - (hours * 60);
  const days = Math.floor(hours / 24);

  return `${(days !== 0) ? `${days}D` : ''} ${(hours !== 0) ? `${hours}H` : ''} ${minutes}M`;
};

export const showPointDataHelper = (dateFrom, dateTo) => {
  const eventDate = dayjs(dateFrom).format('YYYY-MM-DD');
  const shortEventDate = dayjs(dateFrom).format('MMM DD');
  const startTime = dayjs(dateFrom).format('YYYY-MM-DD[T]HH:mm');
  const shortStartTime = dayjs(dateFrom).format('HH:mm');
  const endTime = dayjs(dateTo).format('YYYY-MM-DD[T]HH:mm');
  const shortEndTime = dayjs(dateTo).format('HH:mm');

  return [eventDate, shortEventDate, startTime, shortStartTime, endTime, shortEndTime];
};
