import { Messages } from '../utils/common.js';
import AbstractView from './abstract.js';

const createMessageTemplate = (option) => (
  `<p class="trip-events__msg">${Messages[option]}
  </p>`
);

export default class Message extends AbstractView {
  constructor(option) {
    super();
    this._option = option;
  }

  getTemplate() {
    return createMessageTemplate(this._option);
  }
}

