import SiteMenuView from './view/site-menu.js';
import TripInfoView from './view/trip-info.js';
import { generateEvents } from './mock/points.js';
import { sortByKey } from './utils/utils.js';
import { remove, render, RenderPosition } from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import StatView from './view/stat.js';
import { FiltersType, MenuItem, UpdateType } from './utils/const.js';

const POINT_COUNT = 20;
let statsComponent = null;

const events = new Array(POINT_COUNT).fill().map(generateEvents).sort(sortByKey('dateFrom', true));

const bodyElement = document.querySelector('.page-body');
const headerElement = bodyElement.querySelector('.page-header');
const mainElement = bodyElement.querySelector('.page-main');

const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripFilterElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const statsContainerElement = mainElement.querySelector('.page-body__container');
const addNewEventButton = document.querySelector('.trip-main__event-add-btn');

const pointsModel = new PointsModel();
pointsModel.points = events;

const filterModel = new FilterModel();

const siteMenuComponent = new SiteMenuView();

const renderHeader = (points) => {

  render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

  if (points.length !== 0) {
    render(tripMainElement, new TripInfoView(points), RenderPosition.AFTERBEGIN);
  }
};

const filterPresenter = new FilterPresenter(tripFilterElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, filterModel);

renderHeader(events);
filterPresenter.init();
tripPresenter.init();


const handlePointNewFormClose = () => {
  addNewEventButton.disabled = false;
  // siteMenuComponent.setMenuItem(MenuItem.TABLE);
};

addNewEventButton.addEventListener('click', (evt) => {
  evt.preventDefault();
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FiltersType.DEFAULT);
  tripPresenter.init();
  tripPresenter.createPoint(handlePointNewFormClose);
});

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      filterPresenter.enableFilters();
      addNewEventButton.disabled = false;
      remove(statsComponent);
      tripPresenter.init();
      break;
    case MenuItem.STATS:
      filterPresenter.disableFilters();
      addNewEventButton.disabled = true;
      tripPresenter.destroy();
      statsComponent = new StatView(pointsModel.points);
      render(statsContainerElement, statsComponent, RenderPosition.BEFOREEND);
      break;
  }
};

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
