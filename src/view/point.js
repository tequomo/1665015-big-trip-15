import { getDuration, showPointDataHelper } from '../utils/common.js';
import AbstractView from './abstract.js';


const showOffers = (offers) => `<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${offers.map((offer) =>
    `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`).join('\n')}
  </ul>`;


const createShowPointTemplate = (point) => {
  const { basePrice, dateFrom, dateTo, eventType, isFavorite, eventOffers, destination: { name } } = point;
  const [eventDate, shortEventDate, startTime, shortStartTime, endTime, shortEndTime] = showPointDataHelper(dateFrom, dateTo);

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${eventDate}">${shortEventDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${eventType} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startTime}">${shortStartTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${endTime}">${shortEndTime}</time>
        </p>
        <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      ${eventOffers.length !== 0 ? showOffers(eventOffers) : ''}
      <button class="event__favorite-btn ${(isFavorite) ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};


export default class Point extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    this._buttonClickHandler = this._buttonClickHandler.bind(this);
    this._favoriteButtonClickHandler = this._favoriteButtonClickHandler.bind(this);
  }

  getTemplate() {
    return createShowPointTemplate(this._point);
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();
    this._callback._buttonClick();
  }

  _favoriteButtonClickHandler(evt) {
    evt.preventDefault();
    this._callback._favoriteButtonClick();
  }

  setButtonClickHandler(callback) {
    this._callback._buttonClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._buttonClickHandler);
  }

  setFavoriteButtonClickHandler(callback) {
    this._callback._favoriteButtonClick = callback;
    this.getElement().querySelector('.event__favorite-btn').addEventListener('click', this._favoriteButtonClickHandler);
  }
}
