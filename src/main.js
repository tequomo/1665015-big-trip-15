import SiteMenuView from './view/site-menu.js';
// import { generateEvents } from './mock/points.js';
// import { sortByKey } from './utils/utils.js';
import { remove, render, RenderPosition } from './utils/render.js';
import TripPresenter from './presenter/trip.js';
import FilterPresenter from './presenter/filter.js';
import PointsModel from './model/points.js';
import FilterModel from './model/filter.js';
import StatView from './view/stat.js';
import { FiltersType, MenuItem, UpdateType } from './utils/const.js';
import { hidePseudoElement, showPseudoElement } from './utils/common.js';
import TripInfoPresenter from './presenter/trip-info.js';
import Api from './api/api.js';
import OffersModel from './model/offers.js';
import DestinationsModel from './model/destinations.js';

// const POINT_COUNT = 20;
const URI = 'https://14.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic mu041popsyo';

let statsComponent = null;

// const events = new Array(POINT_COUNT).fill().map(generateEvents).sort(sortByKey('dateFrom', true));

const bodyElement = document.querySelector('.page-body');
const headerElement = bodyElement.querySelector('.page-header');
const mainElement = bodyElement.querySelector('.page-main');

const navigationElement = headerElement.querySelector('.trip-controls__navigation');
const tripMainElement = headerElement.querySelector('.trip-main');
const tripFilterElement = headerElement.querySelector('.trip-controls__filters');
const tripEventsElement = mainElement.querySelector('.trip-events');
const statsContainerElement = mainElement.querySelector('.page-body__container');
const addNewEventButton = document.querySelector('.trip-main__event-add-btn');

const api = new Api(URI, AUTHORIZATION);

const pointsModel = new PointsModel();
const filterModel = new FilterModel();
const offersModel = new OffersModel();
const destinationsModel = new DestinationsModel();

const siteMenuComponent = new SiteMenuView();

const tripInfoPresenter = new TripInfoPresenter(tripMainElement, pointsModel);
const filterPresenter = new FilterPresenter(tripFilterElement, filterModel, pointsModel);
const tripPresenter = new TripPresenter(tripEventsElement, pointsModel, offersModel, destinationsModel, filterModel, api);

// render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);

const handlePointNewFormClose = () => {
  addNewEventButton.disabled = false;
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
      showPseudoElement();
      break;
    case MenuItem.STATS:
      filterPresenter.disableFilters();
      addNewEventButton.disabled = true;
      tripPresenter.destroy();
      statsComponent = new StatView(pointsModel.getPoints());
      render(statsContainerElement, statsComponent, RenderPosition.BEFOREEND);
      hidePseudoElement();
      break;
  }
};


filterPresenter.init();
tripPresenter.init();

api.getInitData()
  .then(([points, offers, destinations]) => {
    pointsModel.setPoints(UpdateType.INIT, points);
    offersModel.offers = offers;
    // console.log(destinations);
    destinationsModel.destinations = destinations;
    tripInfoPresenter.init();
    render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });

// siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
