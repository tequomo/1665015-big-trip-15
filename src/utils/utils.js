export const sortByKey = (key, order) => (a, b) => order ? a[key] - b[key] : b[key] - a[key];

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const capitalize = (string) => string && string[0].toUpperCase() + string.slice(1);
