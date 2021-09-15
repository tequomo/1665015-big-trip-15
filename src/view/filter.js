import AbstractView from './abstract.js';
import { capitalize } from '../utils/utils.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { name, type} = filter;
  return `<div class="trip-filters__filter">
    <input id="filter-${name}" class="trip-filters__filter-input  visually-hidden" type="radio" name="trip-filter" value="${name}" ${type === currentFilterType ? 'checked' : ''}>
    <label class="trip-filters__filter-label" for="filter-${name}">${capitalize(name)}</label>
</div>`;
};

const createTripFilterTemplate = (filters, currentFilterType) => (
  `<form class="trip-filters" action="#" method="get">
    ${filters
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('\n\n')}
  <button class="visually-hidden" type="submit">Accept filter</button>
</form>`
);

export default class Filter extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._radioChangeHandler = this._radioChangeHandler.bind(this);
  }

  getTemplate() {
    return createTripFilterTemplate(this._filters, this._currentFilter);
  }

  setRadioChangeHandler(callback) {
    this._callback.radioChange = callback;
    this.getElement().addEventListener('change', this._radioChangeHandler);
  }

  _radioChangeHandler(evt) {
    evt.preventDefault();
    this._callback.radioChange(evt.target.value);
  }
}
