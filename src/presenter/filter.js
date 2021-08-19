import FilterView from '../view/filter.js';
import { filterOutEverything, filterOutFuture, fiterOutPast } from '../utils/common.js';
import { FilterType } from '../utils/const.js';
import { render, RenderPosition } from '../utils/render.js';

export default class Filter {
  constructor(filtersContainer) {
    this._filtersContainer = filtersContainer;
    this._currentFilterType = FilterType.DEFAULT;

    this._filterComponent = new FilterView();

    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._sourcedPoints = points.slice();

    this._renderFilter();
  }

  _renderFilter() {
    render(this._filtersContainer, this._filterComponent, RenderPosition.BEFOREEND);
    this._filterComponent.setRadioChangeHandler(this._handleFilterTypeChange);
  }

  _filterTrip(filterType) {
    switch (filterType) {
      case FilterType.FUTURE:
        this._points.filter(filterOutFuture);
        break;
      case FilterType.PAST:
        this._points.filter(fiterOutPast);
        break;
      default:
        // this._points = this._sourcedPoints.slice();
        this._points.filter(filterOutEverything);
    }

    this._currentFilterType = filterType;
  }

  _handleFilterTypeChange(filterType) {
    // console.log(filterType);
    this._filterTrip(filterType);
    // this._clearTrip();
    // this._renderTrip();
  }
}
