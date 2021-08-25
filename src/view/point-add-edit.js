import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import rangePlugin from '../../node_modules/flatpickr/dist/plugins/rangePlugin';
import { getAvailableOffers } from '../mock/points.js';
import { mockOffers as ALLOFFERS } from '../mock/offers.js';
import { mockDestinations as ALLDESTINATIONS } from '../mock/destinations.js';
import { capitalize } from '../utils/utils.js';
import SmartView from './smart.js';
import { FormState } from '../utils/const.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';


const showOffers = (availableOffers, selectedOffers) =>
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    <div class="event__available-offers">${availableOffers.map((offer) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${offer.title.split(' ').pop()}-1" type="checkbox" name="event-offer-${offer.title.split(' ').pop()}" ${(selectedOffers.find((item) => item.title === offer.title)) ? 'checked' : ''} >
    <label class="event__offer-label" for="event-offer-${offer.title.split(' ').pop()}-1">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
    </label>
    </div>`).join('\n')}
    </div>
  </section>`;

const showDestination = ({description = '', pictures = ''}) =>
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
    <p class="event__destination-description">${description}</p>
    ${(pictures.length !== 0) ?
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('\n')}
      </div>
    </div>` : ''}
  </section>`;

const generateEventTypesList = (type) => `${ALLOFFERS
  .map((offer) =>
    `<div class="event__type-item">
      <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}"${(offer.type === type.toLowerCase()) ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${capitalize(offer.type)}</label>
    </div>`,
  )
  .join('\n\n')
}`;


const generateDestinationlist = () => `${ALLDESTINATIONS
  .map((destination) =>
    `<option value="${destination.name}"></option>`,
  )
  .join('\n')
}`;

const getDestination = (name, destinations) => (destinations.find((destination) => destination.name === name));


const createAddEditPointTemplate = (point = {}, state) => {
  const {basePrice = '', dateFrom = dayjs(), dateTo = dayjs(), eventType = 'Flight', eventOffers = [], destination = {}} = point;

  const allPointOffers = getAvailableOffers(eventType, ALLOFFERS);
  const destinationInfo = getDestination(destination.name, ALLDESTINATIONS);

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

          <div class="event__type-list">
            <fieldset class="event__type-group">
              <legend class="visually-hidden">Event type</legend>

              ${generateEventTypesList(eventType)}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventType}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name || '' }" list="destination-list-1">
          <datalist id="destination-list-1">
            ${generateDestinationlist()}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD[/]MM[/]YY HH:mm')}">
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD[/]MM[/]YY HH:mm')}">
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
        <button class="event__reset-btn" type="reset">${(state === FormState.DEFAULT) ? 'Delete' : 'Cancel'}</button>
        ${(state === FormState.DEFAULT) ? `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : ''}
      </header>
      <section class="event__details">
        ${allPointOffers.length && showOffers(allPointOffers, eventOffers) || ''}

        ${Object.keys(destinationInfo).length && showDestination(destinationInfo) || ''}
      </section>
    </form>
  </li>`;
};

export default class PointAddEdit extends SmartView {
  constructor(point = {}, state) {
    super();
    this._data = PointAddEdit.parsePointToData(point);
    this._startDatepicker = null;
    this._endDatepicker = null;
    this._rangeDatepicker = null;
    this._state = state;
    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._buttonClickHandler = this._buttonClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    // this._eventStartChangeHandler = this._eventStartChangeHandler.bind(this);
    // this._eventEndChangeHandler = this._eventEndChangeHandler.bind(this);
    this._eventRangeChangeHandler = this._eventRangeChangeHandler.bind(this);
    // this._offersChangeHandler = this._offersChangeHandler.bind(this);

    this._setInnerHandlers();
    // this._setStartDatepicker();
    // this._setEndDatepicker();
    // this.setRangeDatepicker();
  }

  getTemplate() {
    return createAddEditPointTemplate(this._data, this._state);
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callback.formSubmit(PointAddEdit.parseDataToPoint(this._data));
  }

  setRangeDatepicker() {
    if (this._rangeDatepicker) {
      this.removeRangeDatePicker();
    }

    this._rangeDatepicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        // defaultDate: this._data.dateFrom,
        onChange: this._eventRangeChangeHandler,
        plugins: [new rangePlugin({ input: this.getElement().querySelector('#event-end-time-1')})],
      },
    );
  }

  removeRangeDatePicker() {
    this._rangeDatepicker.destroy();
    this._rangeDatepicker = null;
  }


  _setStartDatepicker() {
    if (this._startDatepicker) {
      this._startDatepicker.destroy();
      this._startDatepicker = null;
    }

    this._startDatepicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateFrom,
        onChange: this._eventStartChangeHandler,
      },
    );
  }

  _setEndDatepicker() {
    if (this._endDatepicker) {
      this._endDatepicker.destroy();
      this._endDatepicker = null;
    }

    this._endDatepicker = flatpickr(
      this.getElement().querySelector('#event-end-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        defaultDate: this._data.dateTo,
        onChange: this._eventEndChangeHandler,
        minDate: this._data.dateFrom,
      },
    );
  }

  _buttonClickHandler() {
    this._callback.buttonClick();
  }

  _destinationChangeHandler(evt) {
    const destination = getDestination(evt.target.value, ALLDESTINATIONS);
    this.updateData(
      {
        destination,
      },
    );
  }

  _eventTypeChangeHandler(evt) {
    this.updateData(
      {
        eventType: evt.target.value,
      },
    );
  }

  _eventStartChangeHandler([userDate]) {
    this.updateData(
      {
        dateFrom: userDate,
      },
    );
  }

  _eventEndChangeHandler([userDate]) {
    this.updateData(
      {
        dateTo: userDate,
      },
    );
  }

  _eventRangeChangeHandler([userDateFrom, userDateTo]) {
    this.updateData(
      {
        dateFrom: userDateFrom,
        dateTo: userDateTo,
      },
      true,
    );
  }

  // _offersChangeHandler(evt) {
  //   if(!evt.target.classList.contains('event__offer-checkbox')) {
  //     return;
  //   }
  //   // this.updateData(
  //   //   {
  //   //     offers: [

  //   //     ],
  //   //   },
  //   // );
  // }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._eventTypeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
    // this.getElement().querySelector('.event__details').addEventListener('click', this._offersChangeHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setButtonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._buttonClickHandler);
  }

  restoreHandlers() {
    this._setInnerHandlers();
    // this._setStartDatepicker();
    // this._setEndDatepicker();
    this.setRangeDatepicker();
    this.setFormSubmitHandler(this._callback.formSubmit);
    this.setButtonClickHandler(this._callback.buttonClick);
  }

  static parseDataToPoint(data) {
    return Object.assign(
      {},
      data,
    );
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
    );
  }
}
