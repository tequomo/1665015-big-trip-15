// import { createAddNewPointTemplate } from './view/point-add.js';
import { createEventsListTemplate } from './view/events-list.js';
import { createTripFilterTemplate } from './view/filter.js';
import SiteMenuView from './view/site-menu.js';
import { createEventsSortTemplate } from './view/sort.js';
import TripInfoCostView from './view/trip-info-cost.js';
import TripInfoView from './view/trip-info.js';
import { createShowPointTemplate } from './view/point.js';
import { createAddEditPointTemplate } from './view/point-add-edit.js';
// import { createStatsTemplate } from './view/stat.js';
import { generateEvents } from './mock/points.js';
import { renderNode, renderTemplate, RenderPosition, sortByKey } from './utils/utils.js';

const POINT_COUNT = 20;


const events = new Array(POINT_COUNT).fill().map(generateEvents).sort(sortByKey('dateFrom'));


const bodyNode = document.querySelector('.page-body');
const headerNode = bodyNode.querySelector('.page-header');
const mainNode = bodyNode.querySelector('.page-main');

const navigationNode = headerNode.querySelector('.trip-controls__navigation');
const tripMainNode = headerNode.querySelector('.trip-main');
const tripFilterNode = headerNode.querySelector('.trip-controls__filters');
const tripEventsNode = mainNode.querySelector('.trip-events');
// const statsNode = mainNode.querySelector('.page-body__container');

// renderTemplate(navigationNode, createSiteMenuTemplate(), 'beforeend');
renderNode(navigationNode, new SiteMenuView().getElement(), RenderPosition.BEFOREEND);
renderNode(tripMainNode, new TripInfoView(events).getElement(), RenderPosition.AFTERBEGIN);

const tripInfoNode = headerNode.querySelector('.trip-info');

renderNode(tripInfoNode, new TripInfoCostView(events).getElement(), RenderPosition.BEFOREEND);
renderTemplate(tripFilterNode, createTripFilterTemplate(), 'beforeend');

renderTemplate(tripEventsNode, createEventsSortTemplate(), 'beforeend');
renderTemplate(tripEventsNode, createEventsListTemplate(), 'beforeend');

const tripEventsListNode = tripEventsNode.querySelector('.trip-events__list');

renderTemplate(tripEventsListNode, createAddEditPointTemplate(events[0], true), 'beforeend');
// renderTemplate(tripEventsListNode, createAddNewPointTemplate(), 'beforeend');

for (let i = 1; i < POINT_COUNT; i++) {
  renderTemplate(tripEventsListNode, createShowPointTemplate(events[i]), 'beforeend');
}

// renderTemplate(statsNode, createStatsTemplate(), 'beforeend');
