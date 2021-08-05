import { createNode } from '../utils/utils.js';

const getEventCost = (sum, point) => sum + point.basePrice + point.eventOffers.reduce((acc, offer) => acc + offer.price, 0);

const createTripCostTemplate = (points) => `<p class="trip-info__cost">
  Total: &euro;&nbsp;
  <span class="trip-info__cost-value">${(points.length !== 0) ? points.reduce(getEventCost, 0) : 0}</span>
  </p>`;

export default class TripInfoCost {
  constructor(points) {
    this._node = null;
    this._points = points;
  }

  getTemplate() {
    return createTripCostTemplate(this._points);
  }

  getElement() {
    if (!this._node) {
      this._node = createNode(this.getTemplate());
    }

    return this._node;
  }

  removeElement() {
    this._node = null;
  }
}
