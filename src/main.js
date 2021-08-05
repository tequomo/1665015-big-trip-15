// import { createAddNewPointTemplate } from './view/point-add.js';
import { createEventsListTemplate } from './view/events-list.js';
import { createTripFilterTemplate } from './view/filter.js';
import {createSiteMenuTemplate} from './view/site-menu.js';
import { createEventsSortTemplate } from './view/sort.js';
import { createTripCostTemplate } from './view/trip-info-cost.js';
import { createTripInfoTemplate } from './view/trip-info.js';
import { createShowPointTemplate } from './view/point.js';
import { createAddEditPointTemplate } from './view/point-add-edit.js';
// import { createStatsTemplate } from './view/stat.js';
import { generateEvents } from './mock/points.js';
import { sortByKey } from './utils.js';

const POINT_COUNT = 20;


const events = new Array(POINT_COUNT).fill().map(generateEvents).sort(sortByKey('dateFrom'));

const renderNode = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const bodyNode = document.querySelector('.page-body');
const headerNode = bodyNode.querySelector('.page-header');
const mainNode = bodyNode.querySelector('.page-main');

const navigationNode = headerNode.querySelector('.trip-controls__navigation');
const tripMainNode = headerNode.querySelector('.trip-main');
const tripFilterNode = headerNode.querySelector('.trip-controls__filters');
const tripEventsNode = mainNode.querySelector('.trip-events');
// const statsNode = mainNode.querySelector('.page-body__container');

renderNode(navigationNode, createSiteMenuTemplate(), 'beforeend');
renderNode(tripMainNode, createTripInfoTemplate(events), 'afterbegin');

const tripInfoNode = headerNode.querySelector('.trip-info');

renderNode(tripInfoNode, createTripCostTemplate(events), 'beforeend');
renderNode(tripFilterNode, createTripFilterTemplate(), 'beforeend');

renderNode(tripEventsNode, createEventsSortTemplate(), 'beforeend');
renderNode(tripEventsNode, createEventsListTemplate(), 'beforeend');

const tripEventsListNode = tripEventsNode.querySelector('.trip-events__list');

renderNode(tripEventsListNode, createAddEditPointTemplate(events[0], true), 'beforeend');
// renderNode(tripEventsListNode, createAddNewPointTemplate(), 'beforeend');

for (let i = 1; i < POINT_COUNT; i++) {
  renderNode(tripEventsListNode, createShowPointTemplate(events[i]), 'beforeend');
}

// renderNode(statsNode, createStatsTemplate(), 'beforeend');
