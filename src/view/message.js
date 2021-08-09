// import { showMessage } from '../utils/common.js';
import { createElement } from '../utils/utils.js';

const createMessageTemplate = () => (
  `<p class="trip-events__msg">Click New Event to create your first point
  </p>`
);

export default class Message {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createMessageTemplate();
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }

    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}

