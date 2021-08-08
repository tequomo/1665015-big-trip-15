import dayjs from 'dayjs';

const SHOWN_POINTS = 3;

const messages = {
  'Everything': 'Click New Event to create your first point',
  'Past': 'There are no past events now',
  'Future': 'There are no future events now',
};

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

export const getTrevelTime = (points) => {
  const startDateRaw = dayjs(points[0].dateFrom);
  const endDateRaw = dayjs([...points].pop().dateTo);
  const startDate = dayjs(startDateRaw).format('MMM DD');
  const endDate = (
    dayjs(startDateRaw).month() === dayjs(endDateRaw).month() ?
      dayjs(endDateRaw).format('DD') : dayjs(endDateRaw).format('MMM DD')
  );
  return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
};

export const getTripRoute = (points) => (
  (points.length <= SHOWN_POINTS) ?
    points.map((point) => point.destination.name).join(' &mdash; ') :
    `${points[0].destination.name} &mdash; ... &mdash; ${[...points].pop().destination.name}`
);

export const getTotalCost = (points) => (
  points.
    reduce((sum, point) => (
      sum + point.basePrice + point.eventOffers
        .reduce((summ, offer) => summ + offer.price, 0)
    ), 0)
);

export const showMessage = (filterState) => messages[filterState];
