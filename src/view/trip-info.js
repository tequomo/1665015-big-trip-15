import { getTrevelTime, getTripRoute, getTotalCost } from '../utils/common.js';
import AbstractView from './abstract.js';


const createTripInfoTemplate = (points) => `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      <h1 class="trip-info__title">${getTripRoute(points)}</h1>

      <p class="trip-info__dates">${getTrevelTime(points)}</p>
    </div>

    <p class="trip-info__cost">
      Total: &euro;&nbsp;<span class="trip-info__cost-value">${getTotalCost(points)}</span>
    </p>
  </section>`;

export default class TripInfo extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createTripInfoTemplate(this._points);
  }
}

