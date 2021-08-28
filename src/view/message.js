import { Messages } from '../utils/common.js';
import AbstractView from './abstract.js';

const createMessageTemplate = (filterType) => (
  `<p class="trip-events__msg">${Messages[filterType]}
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

