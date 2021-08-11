import EventsListView from './view/events-list.js';
import FilterView from './view/filter.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import TripInfoView from './view/trip-info.js';
import PointView from './view/point.js';
import PointAddEditView from './view/point-add-edit.js';
import MessageView from './view/message.js';
// import StatView from './view/stat.js';
import { generateEvents } from './mock/points.js';
import { isEscEvent, sortByKey } from './utils/utils.js';
import { render, RenderPosition, replace } from './utils/render.js';
// import { getFilter } from './utils/common.js';

const POINT_COUNT = 20;

const events = new Array(POINT_COUNT).fill().map(generateEvents).sort(sortByKey('dateFrom'));


const bodyElement = document.querySelector('.page-body');
const headerElement = bodyElement.querySelector('.page-header');
const mainElement = bodyElement.querySelector('.page-main');

const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripFilterElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
// const statsElement = mainElement.querySelector('.page-body__container');


const renderPoint = (containerElement, point) => {
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
};

const renderHeader = (points) => {
  const filterComponent = new FilterView(points);

  render(navigationElement, new SiteMenuView, RenderPosition.BEFOREEND);

  if (points.length !== 0) {
    render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
  }

  // filterComponent.setRadioChangeHandler((evt) => points.filter(getFilter[evt.target.value]));

  render(tripFilterElement, filterComponent, RenderPosition.BEFOREEND);
};

const renderBoard = (points) => {
  const eventsListComponent = new EventsListView();

  render(tripEventsElement, new SortView, RenderPosition.BEFOREEND);
  render(tripEventsElement, eventsListComponent, RenderPosition.BEFOREEND);

  if (!points.length) {
    render(tripEventsElement, new MessageView, RenderPosition.BEFOREEND);
  }
  else {
    for (let i = 1; i < POINT_COUNT; i++) {
      renderPoint(eventsListComponent, points[i]);
    }
  }
};

renderHeader(events);
renderBoard(events);

// render(statsElement, new StatView(), RenderPosition.BEFOREEND);
