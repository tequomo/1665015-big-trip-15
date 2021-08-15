import FilterView from './view/filter.js';
import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import { generateEvents } from './mock/points.js';
import { sortByKey } from './utils/utils.js';
import { render, RenderPosition } from './utils/render.js';
import { getFilter } from './utils/common.js';
import TripPresenter from './presenter/trip.js';

const POINT_COUNT = 20;

const events = new Array(POINT_COUNT).fill().map(generateEvents).sort(sortByKey('dateFrom'));


const bodyElement = document.querySelector('.page-body');
const headerElement = bodyElement.querySelector('.page-header');
const mainElement = bodyElement.querySelector('.page-main');

const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripFilterElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');


const renderHeader = (points) => {
  const filterComponent = new FilterView(points);

  render(navigationElement, new SiteMenuView, RenderPosition.BEFOREEND);

  if (points.length !== 0) {
    render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
  }

  filterComponent.setRadioChangeHandler((evt) => points.filter(getFilter[evt.target.value]));

  render(tripFilterElement, filterComponent, RenderPosition.BEFOREEND);
};

const tripPresenter = new TripPresenter(tripEventsElement);

renderHeader(events);
tripPresenter.init(events);
