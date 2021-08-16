import EventsListView from '../view/events-list.js';
import SortView from '../view/sort.js';
import MessageView from '../view/message.js';
import PointPresenter from './point.js';
import { render, RenderPosition } from '../utils/render.js';
import { sortByDuration, sortByPrice, updatePoint } from '../utils/common.js';
import { SortType } from '../utils/const.js';

export default class Trip {
  constructor (tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = new SortView();
    this._eventsListComponent = new EventsListView();
    this._messageComponent = new MessageView();

    this._handlePointChange = this._handlePointChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points) {
    this._points = points.slice();
    this._sourcedPoints = points.slice();

    this._renderSort();
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);

    this._renderTrip(this._points);
  }

  _renderPoint (point) {
    const pointPresenter = new PointPresenter(this._eventsListComponent, this._handlePointChange, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setRadioChangeHandler(this._handleSortTypeChange);
  }

  _renderNoPoint() {
    render(this._tripEventsContainer, this._messageComponent, RenderPosition.BEFOREEND);
  }

  _renderList() {
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _handleModeChange() {
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handlePointChange(updatedPoint) {
    this._points = updatePoint(this._points, updatedPoint);
    this._sourcedPoints = updatePoint(this._sourcedPoints, updatedPoint);
    this._pointPresenter.get(updatedPoint.id).init(updatedPoint);
  }

  _sortTrip(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._points.sort(sortByDuration);
        break;
      case SortType.PRICE:
        this._points.sort(sortByPrice);
        break;
      default:
        this._points = this._sourcedPoints.slice();
        // this._points.sort(sortByDay);
    }

    this._currentSortType = sortType;
  }

  _handleSortTypeChange(sortType) {
    this._sortTrip(sortType);
    this._clearTrip();
    this._renderTrip();
  }

  _clearTrip() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _renderTrip() {
    if (!this._points.length) {
      this._renderNoPoint();
      return;
    }
    this._points.forEach((point) => this._renderPoint(point));
  }
}
