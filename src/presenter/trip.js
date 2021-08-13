import EventsListView from '../view/events-list.js';
import SortView from '../view/sort.js';
import PointView from '../view/point.js';
import PointAddEditView from '../view/point-add-edit.js';
import MessageView from '../view/message.js';
import { isEscEvent } from '../utils/utils.js';
import { render, RenderPosition, replace } from '../utils/render.js';

export default class Trip {
  constructor (tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;

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
    const pointComponent = new PointView(point);
    const pointAddEditComponent = new PointAddEditView(point, true);

    const replacePointToEditForm =() => {
      replace(pointAddEditComponent, pointComponent);
    };

    const replaceEditFormToPoint =() => {
      replace(pointComponent, pointAddEditComponent);
    };

    const onEscCloseEdit = (evt) => {
      if (isEscEvent(evt)) {
        evt.preventDefault();
        replaceEditFormToPoint();
        document.removeEventListener('keydown', onEscCloseEdit);
      }
    };

    pointComponent.setButtonClickHandler(() => {
      replacePointToEditForm();
      document.addEventListener('keydown', onEscCloseEdit);
    });

    pointAddEditComponent.setFormSubmitHandler(() => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscCloseEdit);
    });

    pointAddEditComponent.setButtonClickHandler(() => {
      replaceEditFormToPoint();
      document.removeEventListener('keydown', onEscCloseEdit);
    });

    render(this._eventsListComponent, pointComponent, RenderPosition.BEFOREEND);
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
    }
    else {
      // for (let i = 1; i < POINT_COUNT; i++) {
      //   this._renderPoint(this._eventsListComponent, points[i]);
      // }
      points.forEach((point) => this._renderPoint(point));
    }
  }
}
