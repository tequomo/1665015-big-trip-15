import FilterView from '../view/filter.js';
import { FiltersType, UpdateType } from '../utils/const.js';
import { remove, render, RenderPosition, replace } from '../utils/render.js';
import { filter } from '../utils/common.js';

export default class Filter {
  constructor(filtersContainer, filterModel, pointsModel) {
    this._filtersContainer = filtersContainer;
    this._filterModel = filterModel;
    this._pointsModel = pointsModel;

    this._filterComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);
  }

  init() {
    const filters = this._getFilters();
    const prevFilterComponent = this._filterComponent;

    this._filterComponent = new FilterView(filters, this._filterModel.getFilter());
    this._filterComponent.setRadioChangeHandler(this._handleFilterTypeChange);

    if (prevFilterComponent === null) {
      render(this._filtersContainer, this._filterComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._filterComponent, prevFilterComponent);
    remove(prevFilterComponent);

    const points = this._pointsModel.getPoints();
    const filterItems = this._filterComponent.getElement().querySelectorAll('.trip-filters__filter-input');

    [...filterItems]
      .map((filterItem) => {
        const filteredPoints = filter[filterItem.value](points);
        if(!filteredPoints.length) {
          filterItem.disabled = true;
        }
      });
  }

  disableFilters() {
    const filters = this._filterComponent.getElement().querySelectorAll('.trip-filters__filter-input');
    [...filters].map((input) => input.disabled = true);
  }

  enableFilters() {
    const filters = this._filterComponent.getElement().querySelectorAll('.trip-filters__filter-input');
    [...filters].map((input) => input.disabled = false);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._filterModel.getFilter() === filterType) {
      return;
    }

    this._filterModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return [
      {
        type: FiltersType.DEFAULT,
        name: 'everything',
      },
      {
        type: FiltersType.FUTURE,
        name: 'future',
      },
      {
        type: FiltersType.PAST,
        name: 'past',
      },
    ];
  }
}
