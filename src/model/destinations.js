import AbstractObserver from '../utils/abstract-observer.js';

export default class Destinations extends AbstractObserver {
  constructor() {
    super();
    this._destinations = [];
  }

  set destinations(destinations) {
    this._destinations = destinations.slice();
  }

  get destinations() {
    return this._destinations;
  }
}
