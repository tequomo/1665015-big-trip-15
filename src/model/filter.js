import AbstractObserver from '../utils/abstract-observer.js';
import { FiltersType } from '../utils/const.js';

export default class Filter extends AbstractObserver {
  constructor() {
    super();
    this._activeFilter = FiltersType.DEFAULT;
  }

  setFilter(updateType, filter) {
    this._activeFilter = filter;
    this._notify(updateType, filter);
  }

  getFilter() {
    return this._activeFilter;
  }
}
