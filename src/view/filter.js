import AbstractView from './abstract.js';
import { FilterType } from '../utils/const.js';

const createTripFilterTemplate = () => (
  `<form class="trip-filters" action="#" method="get">
  <div class="trip-filters__filter">
    <input id="filter-everything" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="everything" data-filter-type="${FilterType.DEFAULT}" checked>
    <label class="trip-filters__filter-label" for="filter-everything">Everything</label>
  </div>

  <div class="trip-filters__filter">
    <input id="filter-future" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="future" data-filter-type="${FilterType.FUTURE}">
    <label class="trip-filters__filter-label" for="filter-future">Future</label>
  </div>

  <div class="trip-filters__filter">
    <input id="filter-past" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="past" data-filter-type="${FilterType.PAST}">
    <label class="trip-filters__filter-label" for="filter-past">Past</label>
  </div>

  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`
);

export default class Filter extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
    this._radioChangeHandler = this._radioChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFilterTemplate();
  }

  _radioChangeHandler(evt) {
    this._callback.radioChange(evt.target.dataset.filterType);
  }

  setRadioChangeHandler(callback) {
    this._callback.radioChange = callback;
    this.getElement().addEventListener('change', this._radioChangeHandler);
  }
}
