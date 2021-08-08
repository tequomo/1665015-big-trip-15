import EventsListView from './view/events-list.js';
import FilterView from './view/filter.js';
import SiteMenuView from './view/site-menu.js';
import SortView from './view/sort.js';
import TripInfoView from './view/trip-info.js';
import PointView from './view/point.js';
import PointAddEditView from './view/point-add-edit.js';
// import MessageView from './view/message.js';
// import StatView from './view/stat.js';
import { generateEvents } from './mock/points.js';
import { render, RenderPosition, sortByKey } from './utils/utils.js';

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
    containerElement.replaceChild(pointAddEditComponent.getElement(),pointComponent.getElement());
  };

  const replaceEditFormToPoint =() => {
    containerElement.replaceChild(pointComponent.getElement(), pointAddEditComponent.getElement());
  };

  pointComponent.getElement().querySelector('.event__rollup-btn').addEventListener('click', () => replacePointToEditForm());

  pointAddEditComponent.getElement().querySelector('form').addEventListener('submit', () => replaceEditFormToPoint());

  render(containerElement, pointComponent.getElement(), RenderPosition.BEFOREEND);
};

render(navigationElement, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);

if (events.length !== 0) {
  render(tripMainElement, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);
}

render(tripFilterElement, new FilterView().getElement(), RenderPosition.BEFOREEND);

render(tripEventsElement, new SortView().getElement(), RenderPosition.BEFOREEND);

const eventsListComponent = new EventsListView();
render(tripEventsElement, eventsListComponent.getElement(), RenderPosition.BEFOREEND);

for (let i = 1; i < POINT_COUNT; i++) {
  renderPoint(eventsListComponent.getElement(), events[i]);
}

// render(statsElement, new StatView().getElement(), RenderPosition.BEFOREEND);
