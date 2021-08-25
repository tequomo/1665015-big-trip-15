import EventsListView from '../view/events-list.js';
import SortView from '../view/sort.js';
import MessageView from '../view/message.js';
import PointPresenter from './point.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { sortByDuration, sortByPrice/*, sortByDay*/ } from '../utils/common.js';
import { SortType, UpdateType, UserAction } from '../utils/const.js';

export default class Trip {
  constructor (tripEventsContainer, pointsModel) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointsModel = pointsModel;
    this._pointPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._sortComponent = null;
    this._eventsListComponent = new EventsListView();
    this._messageComponent = new MessageView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._renderTrip();
  }

  _getPoints() {
    switch (this._currentSortType) {
      case SortType.TIME:
        return this._pointsModel.points.slice().sort(sortByDuration);
      case SortType.PRICE:
        return this._pointsModel.points.slice().sort(sortByPrice);
      // default:
      //   return this._pointsModel.points.slice().sort(sortByDay);
    }

    return this._pointsModel.points;
  }

  _renderPoint (point) {
    const pointPresenter = new PointPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setRadioChangeHandler(this._handleSortTypeChange);
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
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

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this._pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this._pointsModel.addPoint(updateType,update);
        break;
      case UserAction.DELETE_POINT:
        this._pointsModel.deletePoint(updateType, update);
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch(updateType) {
      case UpdateType.PATCH:
        this._pointPresenter.get(data.id).init(data);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._eventsListComponent);
    remove(this._messageComponent);
    remove(this._sortComponent);

    if(resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderTrip() {
    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoint();
      return;
    }

    this._renderSort();
    this._renderList();
    points.forEach((point) => this._renderPoint(point));
  }
}
