import { showMessage } from '../utils/common.js';
import AbstractView from './abstract.js';

const createMessageTemplate = () => (
  `<p class="trip-events__msg">${showMessage('Everything')}
  </p>`
);

export default class Message extends AbstractView {
  getTemplate() {
    return createMessageTemplate();
  }
}

