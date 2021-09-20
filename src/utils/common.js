import dayjs from 'dayjs';
import durationPlugin from 'dayjs/plugin/duration';
import { sortByKey } from './utils.js';
import { BrowsingState, FiltersType } from './const.js';

dayjs.extend(durationPlugin);

const SHOWN_POINTS = 3;
const SHAKE_ANIMATION_TIMEOUT = 600;

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
  return durationObject.format(`${!durationObject.days() ? '' : 'DD[D]'} ${!durationObject.hours() && !durationObject.days() ? '' : 'HH[H]'} mm[M]`);
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

const sortPointsByDateFrom = (points) => points.slice().sort((a, b) => a.dateFrom - b.dateFrom);
const sortPointsByDateTo = (points) => points.slice().sort((a, b) => a.dateTo - b.dateTo);

export const getTravelTime = (points) => {
  const sortedPointsOnStart = sortPointsByDateFrom(points);
  const sortedPointsOnEnd = sortPointsByDateTo(points);
  const startDateRaw = dayjs(sortedPointsOnStart[0].dateFrom);
  const endDateRaw = dayjs([...sortedPointsOnEnd].pop().dateTo);
  const startDate = dayjs(startDateRaw).format('MMM DD');
  const endDate = (
    dayjs(startDateRaw).month() === dayjs(endDateRaw).month() ?
      dayjs(endDateRaw).format('DD') : dayjs(endDateRaw).format('MMM DD')
  );

  return `${startDate}&nbsp;&mdash;&nbsp;${endDate}`;
};

export const getTripRoute = (points) => {
  const sortedPointsOnStart = sortPointsByDateFrom(points);
  const sortedPointsOnEnd = sortPointsByDateTo(points);

  return (points.length <= SHOWN_POINTS) ?
    sortedPointsOnStart.map((point) => point.destination.name).join(' &mdash; ') :
    `${sortedPointsOnStart[0].destination.name} &mdash; ... &mdash; ${[...sortedPointsOnEnd].pop().destination.name}`;
};

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

export const getUniqueMarkupName = (title) => title.split(' ').slice(-2).join('-').toLowerCase();

export const addInlineCSS = (id, content) => {
  if (document.querySelector(`#${id}`)) {
    return;
  }

  const inlineCSS = document.createElement('style');
  inlineCSS.id = id;
  inlineCSS.innerHTML = content;
  document.head.appendChild(inlineCSS);
};

export const removeInlineCSS = (id) => {
  const sheetToBeRemoved = document.querySelector(`#${id}`);
  if (sheetToBeRemoved) {
    const sheetParent = sheetToBeRemoved.parentNode;
    sheetParent.removeChild(sheetToBeRemoved);
  }
};

export const StyleId = {
  PSEUDO: 'hide-pseudo',
  SHAKE: 'shake-this',
  TOAST: 'toast-style',
};

export const StyleContent = {
  PSEUDO: `
  *:after {
    content: none !important;
    display: none !important;
  }`,
  SHAKE: `
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
  }`,
  TOAST: `
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
  }`,
};

export const shakeButton = (element) => {
  element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
  setTimeout(() => {
    element.style.animation = '';
  }, SHAKE_ANIMATION_TIMEOUT);
};

export const isOnline = () => window.navigator.onLine;

export const changeHeaderStyle = (element, state) => {
  switch (state) {
    case BrowsingState.ONLINE:
      document.title = document.title.replace(' [offline]', '');
      element.style.backgroundImage = 'url("../img/header-bg.png")';
      element.style.backgroundColor = '#078ff0';
      break;
    case BrowsingState.OFFLINE:
      document.title += ' [offline]';
      element.style.backgroundImage = 'none';
      element.style.backgroundColor = '#96989b';
      break;
  }
};

export const toggleHiddenClass = (element) => {
  element.classList.toggle('trip-events--hidden');
};
