import SiteMenuView from './view/site-menu.js';
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

const URI = 'https://15.ecmascript.pages.academy/big-trip/';
const AUTHORIZATION = 'Basic mu041popsyo';

let statsComponent = null;

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

const handlePointNewFormClose = () => {
  addNewEventButton.disabled = false;
};

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

const startApp = () => {
  tripInfoPresenter.init();
  filterPresenter.init();
  render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
  siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  tripPresenter.init();

  addNewEventButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    tripPresenter.destroy();
    filterModel.setFilter(UpdateType.MAJOR, FiltersType.DEFAULT);
    tripPresenter.init();
    tripPresenter.createPoint(handlePointNewFormClose);
  });
};

api.getInitData()
  .then(([points, offers, destinations]) => {
    offersModel.setOffers(offers);
    destinationsModel.setDestinations(destinations);
    pointsModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    pointsModel.setPoints(UpdateType.INIT, []);
    render(navigationElement, siteMenuComponent, RenderPosition.BEFOREEND);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
  });


startApp();

