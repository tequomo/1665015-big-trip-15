import EventsListView from './view/events-list.js';
import FilterView from './view/filter.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import TripInfoView from './view/trip-info.js';
import PointView from './view/point.js';
import PointAddEditView from './view/point-add-edit.js';
import MessageView from './view/message.js';
// import StatView from './view/stat.js';
import { isEscEvent } from './utils/utils.js';
import { render, RenderPosition, replace } from './utils/render.js';
import { getFilter } from './utils/common.js';

const POINT_COUNT = 20;

export default class Trip {
  constructor (siteMenuContainer, filterContainer, tripEventsContainer, tripInfoContainer) {
    //  tripFilterElement
    this._filterContainer = filterContainer;
    //  tripEventsElement
    this._tripEventsContainer = tripEventsContainer;
    //  tripMainElement
    this._tripInfoContainer = tripInfoContainer;
    //  navigationElement
    this._siteMenuContainer = siteMenuContainer;

    this._siteMenuComponent = new SiteMenuView();
    this._filterComponent = new FilterView();
    this._sortComponent = new SortView();
    this._eventsListComponent = new EventsListView();
    this._messageComponent = new MessageView();

  }

  init  () {

  }

  _renderPoint (containerElement, point) {
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

    render(containerElement, pointComponent, RenderPosition.BEFOREEND);
  }

  // _renderSiteMenu() {
  //   render(navigationElement, this._siteMenuComponent, RenderPosition.BEFOREEND);
  // }

  _renderNoPoint(points) {
    if (points.length !== 0) {
      render(this._tripInfoContainer, new TripInfoView(points), RenderPosition.AFTERBEGIN);
    }
  }

  _renderFilter(points) {
    this._filterComponent.setRadioChangeHandler((evt) => points.filter(getFilter[evt.target.value]));

    render(this._filterContainer, this._filterComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderHeader() {

  }

  _renderList() {
    render(this._tripEventsContainer, this._eventsListComponent, RenderPosition.BEFOREEND);
  }

  _renderTrip(points) {

    if (!points.length) {
      render(this._tripEventsContainer, this._messageComponent, RenderPosition.BEFOREEND);
    }
    else {
      for (let i = 1; i < POINT_COUNT; i++) {
        this._renderPoint(this._eventsListComponent, points[i]);
      }
    }
  }
}
