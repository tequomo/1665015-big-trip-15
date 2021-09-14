import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { sortByKey } from './utils.js';
import { FiltersType } from './const.js';

dayjs.extend(durationPlugin);

const SHOWN_POINTS = 3;

export const Messages = {
  [FiltersType.DEFAULT]: 'Click New Event to create your first point',
  [FiltersType.PAST]: 'There are no past events now',
  [FiltersType.FUTURE]: 'There are no future events now',
  LOADING: 'Loading...',
};

export const filter = {
  [FiltersType.DEFAULT]: (points) => points.filter((point) => point === point),
  [FiltersType.FUTURE]: (points) => points.filter((point) => point.dateFrom >= dayjs() || point.dateFrom < dayjs() & dayjs() < point.dateTo),
  [FiltersType.PAST]: (points) => points.filter((point) => (point.dateTo < dayjs()) || point.dateFrom < dayjs() & dayjs() < point.dateTo),
};

export const getEventTimeDiff = (point) => (dayjs(point.dateTo)).diff(dayjs(point.dateFrom));

export const formatDuration = (time) => {
  const durationObject = dayjs.duration(time);
  return durationObject.format(`${!durationObject.days() ? '' : 'DD[D]'} ${!durationObject.hours() && !durationObject.days()  ? '' : 'HH[H]'} mm[M]`);
};

export const getDuration = (point) => {
  const diffInMinutes = getEventTimeDiff(point);
  return formatDuration(diffInMinutes);
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

export const getTravelTime = (points) => {
  const sortedByDateFrom = points.slice().sort((a, b) => a.dateFrom - b.dateFrom);
  const sortedByDateTo = points.slice().sort((a, b) => a.dateTo - b.dateTo);
  const startDateRaw = dayjs(sortedByDateFrom[0].dateFrom);
  const endDateRaw = dayjs([...sortedByDateTo].pop().dateTo);
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

export const isDatesEqual = (dateA, dateB) => (dateA === null && dateB === null) ? true : dayjs(dateA).isSame(dateB);

export const sortByDay = sortByKey('dateFrom', true);

export const sortByDuration = (pointA, pointB) => getEventTimeDiff(pointB) - getEventTimeDiff(pointA);

export const sortByPrice = sortByKey('basePrice');

export const hidePseudoElement = () => {
  const styleSheet = document.createElement('style');
  styleSheet.id = 'no-pseudo';
  styleSheet.innerHTML = '*:after {content: none !important; display: none !important;}';
  document.body.appendChild(styleSheet);
};

export const showPseudoElement = () => {
  const sheetToBeRemoved = document.querySelector('#no-pseudo');
  const sheetParent = sheetToBeRemoved.parentNode;
  sheetParent.removeChild(sheetToBeRemoved);
};

export const getUniqueMarkupName = (title) => title.split(' ').slice(-2).join('-').toLowerCase();

export const addAnimationCSS = () => {
  if(document.querySelector('shake-this')) {
    return;
  }

  const animationCSS = document.createElement('style');
  animationCSS.id = 'shake-this';
  animationCSS.innerHTML = `
  @keyframes shake {
    0%,
    100% {
      transform: translateX(0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
      transform: translateX(-5px);
    }

    20%,
    40%,
    60%,
    80% {
      transform: translateX(5px);
    }
  }

  .shake {
    animation: shake 0.6s;
  }`;
  document.head.appendChild(animationCSS);
};

export const removeAnimationCSS =() => {
  const sheetToBeRemoved = document.querySelector('#shake-this');
  if(sheetToBeRemoved) {
    const sheetParent = sheetToBeRemoved.parentNode;
    sheetParent.removeChild(sheetToBeRemoved);
  }
};

export const isOnline = () => window.navigator.onLine;

export const addToastCSS = () => {
  if(document.querySelector('toast-style')) {
    return;
  }

  const toastCSS = document.createElement('style');
  toastCSS.id = 'toast-style';

  toastCSS.innerHTML = `
  .toast-container {
    position: absolute;
    z-index: 1000;
    top: 0;
    right: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding-top: 0.4em;
    padding-left: 0.4em;
    width: 100%;
    height: 0;
    font-family: sans-serif;
    font-size: 16px;
    line-height: 1.5;
    box-sizing: border-box;
  }

  .toast-item {
    display: inline-flex;
    margin-bottom: 0.4em;
    padding: 0.4em;
    border-radius: 0.2em;
    background-color: #575a5f;
    color: #ffffff;
  }`;
  document.head.appendChild(toastCSS);
};

export const removeToastCSS =() => {
  const sheetToBeRemoved = document.querySelector('#toast-style');
  if(sheetToBeRemoved) {
    const sheetParent = sheetToBeRemoved.parentNode;
    sheetParent.removeChild(sheetToBeRemoved);
  }
};
