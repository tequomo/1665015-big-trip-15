import dayjs from 'dayjs';

export const Mode = {
  DEFAULT: 'DEFAULT',
  EDITING: 'EDITING',
};

export const SortType = {
  DEFAULT: 'day',
  TIME: 'time',
  PRICE: 'price',
};

export const FiltersType = {
  DEFAULT: 'everything',
  FUTURE: 'future',
  PAST: 'past',
};

export const FormState = {
  DEFAULT: 'EDIT',
  ADD: 'ADD',
};

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
};

export const MenuItem = {
  TABLE: 'Table',
  STATS: 'Stats',
};

export const NEW_POINT = {
  'eventType': '',
  'dateFrom': dayjs(),
  'dateTo': dayjs(),
  'destination': {
    'name': '',
    'description': '',
    'pictures': [],
  },
  'basePrice': '',
  'isFavorite': false,
  'eventOffers': [],
};
