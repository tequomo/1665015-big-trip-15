import EventsListView from '../view/events-list.js';
import SortView from '../view/sort.js';
import MessageView from '../view/message.js';
import PointPresenter from './point.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { filter, sortByDuration, sortByPrice, sortByDay, addAnimationCSS, removeAnimationCSS } from '../utils/common.js';
import { FiltersType, SortType, UpdateType, UserAction, ProcessingState as PointPresenterProcessingState } from '../utils/const.js';
import PointNewPresenter from './point-new.js';

export default class Trip {
  constructor (tripEventsContainer, pointsModel, offersModel, destinationsModel, filterModel, api) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointsModel = pointsModel;
    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;
    this._filterModel = filterModel;
    this._api = api;

    this._pointPresenter = new Map();
    this._filterType = FiltersType.DEFAULT;
    this._currentSortType = SortType.DEFAULT;

    this._loadingState = 'LOADING';
    this._isLoading = true;

    this._sortComponent = null;
    this._eventsListComponent = new EventsListView();
    this._messageComponent = null;

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);


    this._pointNewPresenter = new PointNewPresenter(this._eventsListComponent, this._handleViewAction, offersModel, destinationsModel);
  }

  init() {
    this._pointsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  _getPoints() {
    this._filterType = this._filterModel.getFilter();
    const points = this._pointsModel.getPoints();
    const filteredPoints = filter[this._filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filteredPoints.sort(sortByDuration);
      case SortType.PRICE:
        return filteredPoints.sort(sortByPrice);
      default:
        return filteredPoints.sort(sortByDay);
    }
  }

  _renderPoint (point) {
    const pointPresenter = new PointPresenter(this._eventsListComponent, this._handleViewAction, this._handleModeChange, this._offersModel, this._destinationsModel);
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
    this._messageComponent = new MessageView(this._filterType);
    render(this._tripEventsContainer, this._messageComponent, RenderPosition.BEFOREEND);
  }

  _renderLoading() {
    this._messageComponent = new MessageView(this._loadingState);
    render(this._tripEventsContainer, this._messageComponent, RenderPosition.BEFOREEND);
  }

  _renderList() {
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  createPoint(callback) {
    this._currentSortType = SortType.DEFAULT;
    this._filterModel.setFilter(UpdateType.MAJOR, FiltersType.DEFAULT);
    this._pointNewPresenter.init(callback);
    document.querySelector('.trip-main__event-add-btn').disabled = true;
    addAnimationCSS();
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    this._pointsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _handleModeChange() {
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleViewAction(actionType, updateType, update) {
    switch(actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter.get(update.id).setProcessingState(PointPresenterProcessingState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._pointsModel.updatePoint(updateType, response);
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setProcessingState(PointPresenterProcessingState.ABORTING);
          });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._pointsModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter.get(update.id).setProcessingState(PointPresenterProcessingState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._pointsModel.deletePoint(updateType, update);
            removeAnimationCSS();
          })
          .catch(() => {
            this._pointPresenter.get(update.id).setProcessingState(PointPresenterProcessingState.ABORTING);
          });
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
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._messageComponent);
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
    this._pointNewPresenter.destroy();
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();

    remove(this._eventsListComponent);
    if(this._messageComponent) {
      remove(this._messageComponent);
    }
    remove(this._sortComponent);

    if(resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

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
