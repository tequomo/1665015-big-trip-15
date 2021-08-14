import EventsListView from '../view/events-list.js';
import SortView from '../view/sort.js';
import MessageView from '../view/message.js';
import PointPresenter from './point.js';
import { render, RenderPosition } from '../utils/render.js';

export default class Trip {
  constructor (tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointPresenter = new Map();

    this._sortComponent = new SortView();
    this._eventsListComponent = new EventsListView();
    this._messageComponent = new MessageView();
  }

  init(points) {
    this._points = points.slice();

    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);

    this._renderTrip(this._points);
  }

  _renderPoint (point) {
    const pointPresenter = new PointPresenter(this._eventsListComponent);
    pointPresenter.init(point);
    this._pointPresenter.set(point.id, pointPresenter);
  }

  _clearPointList() {
    this._pointPresenter.forEach((presenter) => presenter.destroy());
    this._pointPresenter.clear();
  }

  _renderNoPoint() {
    render(this._tripEventsContainer, this._messageComponent, RenderPosition.BEFOREEND);
  }

  _renderList() {
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip(points) {
    if (!points.length) {
      this._renderNoPoint();
      return;
    }
    points.forEach((point) => this._renderPoint(point));
  }
}
