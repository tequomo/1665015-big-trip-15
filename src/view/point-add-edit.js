import dayjs from 'dayjs';
import flatpickr from 'flatpickr';
import rangePlugin from '../../node_modules/flatpickr/dist/plugins/rangePlugin';
import { capitalize } from '../utils/utils.js';
import SmartView from './smart.js';
import { FormState } from '../utils/const.js';
import { getUniqueMarkupName } from '../utils/common.js';

import '../../node_modules/flatpickr/dist/flatpickr.min.css';

const getAvailableOffers = (type, offers) => (offers.find((offer) => offer.type.toLowerCase() === type.toLowerCase())).offers;

const generateOffersList = (availableOffers, selectedOffers, isDisabled) => `
  <div class="event__available-offers">${availableOffers.map((offer) => `<div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${getUniqueMarkupName(offer.title)}-1" type="checkbox" name="event-offer-${getUniqueMarkupName(offer.title)}" ${(selectedOffers.find((item) => item.title === offer.title)) ? 'checked' : ''} ${isDisabled ? 'disabled' : ''} data-offer-title="${offer.title}" data-offer-price="${offer.price}">
    <label class="event__offer-label" for="event-offer-${getUniqueMarkupName(offer.title)}-1">
      <span class="event__offer-title">${offer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${offer.price}</span>
    </label>
    </div>`).join('\n')}
  </div>`;

const showOffers = (availableOffers, selectedOffers, type, isDisabled) =>
  `<section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>
    ${!type ? 'Please select event type for additional offers' : generateOffersList(availableOffers, selectedOffers, isDisabled) }
  </section>`;

const generateDestinationInfo = ({description = '', pictures = []}) => `
  <p class="event__destination-description">${description}</p>
  ${(pictures.length !== 0) ?
    `<div class="event__photos-container">
      <div class="event__photos-tape">
      ${pictures.map((picture) =>
    `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`).join('\n')}
      </div>
    </div>` : ''}`;

const showDestination = (destination) =>
  `<section class="event__section  event__section--destination">
    <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      ${!Object.keys(destination).length ? generateDestinationInfo({description: 'Please select the destination for preview', pictures: []}) : generateDestinationInfo(destination)}
  </section>`;

const generateEventTypesList = (type, offers) => `${offers
  .map((offer) =>
    `<div class="event__type-item">
      <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}"${(offer.type === type.toLowerCase()) ? 'checked' : ''}>
      <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${capitalize(offer.type)}</label>
    </div>`,
  )
  .join('\n\n')
}`;


const generateDestinationlist = (destinations) => `${destinations
  .map((destination) =>
    `<option value="${destination.name}"></option>`,
  )
  .join('\n')
}`;

const getDestination = (name, destinations) => (destinations.find((destination) => destination.name === name));


const createAddEditPointTemplate = (point, offers, destinations, state) => {
  const {
    basePrice,
    dateFrom,
    dateTo,
    eventType,
    eventOffers,
    destination,
    isDisabled,
    isSaving,
    isDeleting,
  } = point;

  const allPointOffers = eventType ? getAvailableOffers(eventType, offers) : [];
  const destinationInfo = getDestination(destination.name, destinations) || {};

  return `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${eventType ? eventType.toLowerCase() : 'transport'}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

          <div class="event__type-list">
            <fieldset class="event__type-group" ${isDisabled ? 'disabled' : ''}>
              <legend class="visually-hidden">Event type</legend>

              ${generateEventTypesList(eventType, offers)}

            </fieldset>
          </div>
        </div>

        <div class="event__field-group  event__field-group--destination">
          <label class="event__label  event__type-output" for="event-destination-1">
            ${eventType ? eventType : 'Select type'}
          </label>
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name || '' }" list="destination-list-1" ${isDisabled ? 'disabled' : ''} placeholder="Select destination">
          <datalist id="destination-list-1">
            ${generateDestinationlist(destinations)}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format('DD[/]MM[/]YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format('DD[/]MM[/]YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" pattern="^[ 0-9]+$" ${isDisabled ? 'disabled' : ''}>
        </div>

        <button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
        <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${(state === FormState.DEFAULT) ? `${isDeleting ? 'Deleting...' : 'Delete'}` : 'Cancel'}</button>
        ${(state === FormState.DEFAULT) ? `<button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>` : ''}
      </header>
      <section class="event__details">
        ${allPointOffers.length && showOffers(allPointOffers, eventOffers, eventType, isDisabled) || `${state === FormState.ADD && eventType === '' ? showOffers(allPointOffers, eventOffers, eventType, isDisabled) : ''}`}

        ${Object.keys(destinationInfo).length && showDestination(destinationInfo) || `${state === FormState.ADD ? showDestination(destinationInfo) : ''}`}
      </section>
    </form>
  </li>`;
};

export default class PointAddEdit extends SmartView {
  constructor(point, offersModel, destinationsModel, state) {
    super();
    this._data = PointAddEdit.parsePointToData(point);
    this._rangeDatepicker = null;
    this._state = state;

    this._offers = offersModel.getOffers();
    this._destinations = destinationsModel.getDestinations();


    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._buttonClickHandler = this._buttonClickHandler.bind(this);
    this._buttonDeleteClickHandler = this._buttonDeleteClickHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);
    this._eventTypeChangeHandler = this._eventTypeChangeHandler.bind(this);
    this._eventRangeChangeHandler = this._eventRangeChangeHandler.bind(this);
    this._eventPriceChangeHandler = this._eventPriceChangeHandler.bind(this);

    this._setInnerHandlers();
  }

  getTemplate() {
    return createAddEditPointTemplate(this._data, this._offers, this._destinations, this._state);
  }

  removeElement() {
    super.removeElement();
    this.removeRangeDatePicker();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._checkOffersHandler();
    this._callback.formSubmit(PointAddEdit.parseDataToPoint(this._data));
  }

  _buttonClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonClick();
  }

  _buttonDeleteClickHandler(evt) {
    evt.preventDefault();
    this._callback.buttonDeleteClick(PointAddEdit.parseDataToPoint(this._data));
  }

  _destinationChangeHandler(evt) {
    const destination = getDestination(evt.target.value, this._destinations);
    const destinationInput = this.getElement().querySelector('.event__input--destination');
    if(destination === undefined) {
      destinationInput.setCustomValidity('Unfortunately this place unable for a trip');
      destinationInput.reportValidity();
      return;
    }
    destinationInput.setCustomValidity('');
    destinationInput.reportValidity();
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

  _eventRangeChangeHandler([userDateFrom, userDateTo]) {
    this.updateData(
      {
        dateFrom: userDateFrom,
        dateTo: userDateTo,
      },
      true,
    );
  }

  _checkOffersHandler() {
    if(!this.getElement().querySelector('.event__available-offers')) {
      return;
    }

    const availableOffers = getAvailableOffers(this._data.eventType, this._offers);
    const selectedOffers = this.getElement().querySelectorAll('.event__offer-checkbox:checked');

    const offers = availableOffers.filter((offer) => [...selectedOffers].find((item) => offer.title === item.dataset.offerTitle));

    this.updateData(
      {
        eventOffers: offers,
      },
      true,
    );
  }

  _eventPriceChangeHandler(evt) {
    const basePrice = Number(evt.target.value);
    if(basePrice > 0) {
      this.updateData(
        {
          basePrice,
        },
        true,
      );
    }
  }

  _setInnerHandlers() {
    this.getElement().querySelector('.event__type-group').addEventListener('change', this._eventTypeChangeHandler);
    this.getElement().querySelector('.event__input--destination').addEventListener('change', this._destinationChangeHandler);
  }

  setPriceChangeHandler(callback) {
    this._callback.priceChange = callback;
    this.getElement().querySelector('.event__input--price').addEventListener('input', this._eventPriceChangeHandler);
  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('form').addEventListener('submit', this._formSubmitHandler);
  }

  setButtonClickHandler(callback) {
    this._callback.buttonClick = callback;
    this.getElement().querySelector('.event__rollup-btn').addEventListener('click', this._buttonClickHandler);
  }

  setButtonDeleteClickHandler(callback) {
    this._callback.buttonDeleteClick = callback;
    this.getElement().querySelector('.event__reset-btn').addEventListener('click', this._buttonDeleteClickHandler);
  }

  setRangeDatepicker() {
    this.removeRangeDatePicker();

    this._rangeDatepicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        onClose: this._eventRangeChangeHandler,
        plugins: [new rangePlugin({ input: this.getElement().querySelector('#event-end-time-1')})],
      },
    );
  }

  removeRangeDatePicker() {
    if (this._rangeDatepicker) {
      this._rangeDatepicker.destroy();
      this._rangeDatepicker = null;
    }
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this.setRangeDatepicker();
    this.setPriceChangeHandler();
    this.setFormSubmitHandler(this._callback.formSubmit);
    if(this._state === FormState.DEFAULT) {
      this.setButtonClickHandler(this._callback.buttonClick);
    }
    this.setButtonDeleteClickHandler(this._callback.buttonDeleteClick);
  }

  static parseDataToPoint(data) {
    data = Object.assign({}, data);

    delete data.isDisabled;
    delete data.isSaving;
    delete data.isDeleting;

    return data;
  }

  static parsePointToData(point) {
    return Object.assign(
      {},
      point,
      {
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      },
    );
  }
}
