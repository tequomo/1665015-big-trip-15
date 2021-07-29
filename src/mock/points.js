import { getRandomInteger, getRandomLengthArray } from '../utils.js';
import dayjs from 'dayjs';

const EVENT_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant',
];

const EVENT_CITIES = [
  'Amsterdam',
  'Chamonix',
  'Geneva',
  'Liege',
  'Brugge',
];

const CITIES_DESCRIPTIONS = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Cras aliquet varius magna, non porta ligula feugiat eget.',
  'Fusce tristique felis at fermentum pharetra.',
  'Aliquam id orci ut lectus varius viverra.',
  'Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante.',
  'Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
  'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui.',
  'Sed sed nisi sed augue convallis suscipit in sed felis.',
  'Aliquam erat volutpat.',
  'Nunc fermentum tortor ac porta dapibus.',
  'In rutrum ac purus sit amet tempus.',
];

const COST_MIN = 0;
const COST_MAX = 800;
const PHRASE_COUNT_MIN = 1;
const PHRASE_COUNT_MAX = 5;

const getRandomValue = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

export const generateEvents = () => {
  const eventType = getRandomValue(EVENT_TYPES);
  const eventCity = getRandomValue(EVENT_CITIES);
  const eventCitiesDescription = getRandomLengthArray(CITIES_DESCRIPTIONS, getRandomInteger(PHRASE_COUNT_MIN, PHRASE_COUNT_MAX)).join(' ');
  const isFavorite = Boolean(getRandomInteger(0, 1));

  const maxTripDuration = 7;
  const daysGap = getRandomInteger(1, maxTripDuration);
  const eventStartTime = dayjs().add(daysGap, 'day').format('DD/MM/YYYY HH:mm');
  const eventEndTime = dayjs().add(daysGap, 'day').add(daysGap, 'hour').format('DD/MM/YYYY HH:mm');

  return {
    eventType,
    eventCity,
    eventCitiesDescription,
    eventStartTime,
    eventEndTime,
    eventCost: getRandomInteger(COST_MIN, COST_MAX),
    eventOffers: null,
    isFavorite,
  };
};
