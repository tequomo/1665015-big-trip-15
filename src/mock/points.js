import { getBoolean, getRandomInteger, getRandomLengthArray, getRandomValue } from '../utils/utils.js';
import dayjs from 'dayjs';
import { nanoid } from 'nanoid';
import { mockOffers as ALLOFFERS } from './offers.js';
import { mockDestinations } from './destinations.js';

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

// const EVENT_CITIES = [
//   'Amsterdam',
//   'Chamonix',
//   'Geneva',
//   'Liege',
//   'Brugge',
// ];

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

// const OFFERS_TITLES = [
//   'Laundry',
//   'Choose meal',
//   'Order meal',
//   'Choose seats',
//   'Add luggage',
//   'Drive slowly',
//   'Add breakfast',
//   'Travel by train',
//   'Choose VIP area',
//   'Infotainment system',
//   'Choose temperature',
//   'Choose comfort class',
//   'Choose business class',
//   'Choose the radio station',
// ];

const offerTitles = [...new Set(
  ALLOFFERS
    .reduce(
      (prev, curr) =>
        [...prev,
          ...curr.offers
            .map(
              (offer) => offer.title,
            ),
        ],
      [],
    ),
),
];

export const eventCities = mockDestinations.map((destination) => destination.name);

const COST_MIN = 0;
const COST_MAX = 500;
const PHRASE_COUNT_MIN = 1;
const PHRASE_COUNT_MAX = 5;
const MAX_DAYS_INTERVAL = 7;
const MAX_HOURS_INTERVAL = 12;
const MAX_MINUTES_INTERVAL = 30;
const OFFER_MIN_PRICE = 10;
const OFFER_MAX_PRICE = 200;


const generateDestination = () => {
  const name = getRandomValue(eventCities);
  const description = getRandomLengthArray(DESTINATION_DESCRIPTIONS, getRandomInteger(PHRASE_COUNT_MIN, PHRASE_COUNT_MAX)).join(' ');
  const pictures = new Array(getRandomInteger(1, 5)).fill().map(() => ({'src': `http://picsum.photos/248/152?r='${Math.random()}`, 'description': `${name} ${getRandomValue(DESTINATION_DESCRIPTIONS)}`}));

  return {
    name,
    description,
    pictures,
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

export const generateOffers = () => EVENT_TYPES.map(
  (value) => (
    {'type': value,
      'offers': new Array(getRandomInteger(0, 5)).fill().map(
        () =>
          ({
            'title': offerTitles[getRandomInteger(0, offerTitles.length-1)],
            'price': getRandomInteger(OFFER_MIN_PRICE, OFFER_MAX_PRICE),
          }),
      ),
    }),
);

// const allOffers = generateOffers();

const getAvailableOffers = (type, offers) => (offers.find((offer) => offer.type.toLowerCase() === type.toLowerCase())).offers;

const getSelectedOffers = (type, offers) => {
  const availableOffers = getAvailableOffers(type, offers);
  return availableOffers.slice(0, getRandomInteger(0, availableOffers.length));
};

const eventsDataHelper = () => {
  const eventType = getRandomValue(EVENT_TYPES);
  const isFavorite = getBoolean(getRandomInteger(0, 1));
  const dates = generateDate();
  const dateFrom = Math.min(...dates);
  const dateTo = Math.max(...dates);
  const basePrice = getRandomInteger(COST_MIN, COST_MAX);
  const destination = generateDestination();
  const eventOffers = getSelectedOffers(eventType, ALLOFFERS);
  return [eventType, isFavorite, dateFrom, dateTo, basePrice, destination, eventOffers];
};


export const generateEvents = () => {
  const [ eventType, isFavorite, dateFrom, dateTo, basePrice, destination, eventOffers ] = eventsDataHelper();

  return {
    basePrice,
    dateFrom,
    dateTo,
    destination,
    id: nanoid(),
    isFavorite,
    eventOffers,
    eventType,
  };
};

export { getAvailableOffers };
