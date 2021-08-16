export const getRandomInteger = (min, max) => {
  const rand = min + Math.random() * (max + 1 - min);
  return Math.floor(rand);
};

const shuffleArray = (array) => {
  for (let currentIndex = array.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
};

export const getRandomLengthArray = (sourceArray, maxLength) => {
  shuffleArray(sourceArray);
  return sourceArray.slice(0, getRandomInteger(1, maxLength));
};

export const getRandomValue = (array) => array[getRandomInteger(0, array.length - 1)];

export const sortByKey = (key, order) => (a, b) => order ? a[key] - b[key] : b[key] - a[key];

export const getBoolean = () => Boolean(getRandomInteger(0, 1));

export const isEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';
