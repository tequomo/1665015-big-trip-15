import AbstractObserver from '../utils/abstract-observer.js';

export default class Offers extends AbstractObserver {
  constructor() {
    super();
    this._offers = [];
  }

  set offers(offers) {
    this._offers = offers.slice();
  }

  get offers() {
    return this._offers;
  }
}
