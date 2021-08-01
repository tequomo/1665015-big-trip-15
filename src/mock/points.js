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

const DESTINATION_DESCRIPTIONS = [
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

const OFFERS_TITLES = [
  'Choose meal',
  'Choose seats',
  'Add luggage',
  'Add breakfast',
  'Travel by train',
  'Choose temperature',
  'Choose comfort class',
  'Choose business class',
];

const COST_MIN = 0;
const COST_MAX = 500;
const PHRASE_COUNT_MIN = 1;
const PHRASE_COUNT_MAX = 5;
const MAX_DAYS_INTERVAL = 7;
const MAX_HOURS_INTERVAL = 12;
const MAX_MINUTES_INTERVAL = 30;
const OFFER_MIN_PRICE = 10;
const OFFER_MAX_PRICE = 200;


const getRandomValue = (array) => {
  const randomIndex = getRandomInteger(0, array.length - 1);
  return array[randomIndex];
};

const generateDestination = () => {
  const name = getRandomValue(EVENT_CITIES);
  const description = getRandomLengthArray(DESTINATION_DESCRIPTIONS, getRandomInteger(PHRASE_COUNT_MIN, PHRASE_COUNT_MAX)).join(' ');

  return {
    name,
    description,
    picture: [
      {
        src: '',
        description: '',
      },
    ],
  };
};

const generateDate = () => {
  const daysInterval = getRandomInteger(-MAX_DAYS_INTERVAL, MAX_DAYS_INTERVAL);
  const hoursInterval = getRandomInteger(-MAX_HOURS_INTERVAL, MAX_HOURS_INTERVAL);
  const minutesInterval = getRandomInteger(-MAX_MINUTES_INTERVAL, MAX_MINUTES_INTERVAL);

  return [
    dayjs().add(daysInterval, 'day').toDate(),
    dayjs().add(daysInterval, 'day').add(hoursInterval, 'hour').add(minutesInterval, 'minute').toDate(),
  ];
};

// const generateOffers = () => new Array(getRandomInteger(0, 4)).fill().map(() => ({'title': OFFERS_TITLES[getRandomInteger(0, OFFERS_TITLES.length-1)], 'price': getRandomInteger(OFFER_MIN_PRICE, OFFER_MAX_PRICE)}));

const generateOffers = () => {
  const offers = new Array(getRandomInteger(0, 4)).fill().map(() => ({'title': OFFERS_TITLES[getRandomInteger(0, OFFERS_TITLES.length-1)], 'price': getRandomInteger(OFFER_MIN_PRICE, OFFER_MAX_PRICE)}));

  const uniqueOffers = offers.reduce((acc, offer) => acc.map[offer.title] ? acc : ((acc.map[offer.title] = true), acc.uniqueOffers.push(offer), acc), {
    map: {},
    uniqueOffers: [],
  }).uniqueOffers;
  return uniqueOffers;
};

export const generateEvents = () => {
  const eventType = getRandomValue(EVENT_TYPES);
  const isFavorite = Boolean(getRandomInteger(0, 1));

  const dates = generateDate();
  const dateFrom = Math.min(...dates);
  const dateTo = Math.max(...dates);
  const basePrice = getRandomInteger(COST_MIN, COST_MAX);
  const destination = generateDestination();
  const eventOffers = generateOffers();
  // console.log(eventOffers);
  return {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    id: 0,
    isFavorite,
    eventOffers,
    eventType,
  };
};
