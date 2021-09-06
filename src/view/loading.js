import AbstractView from './abstract.js';

const createLoadingTemplate = () => (
  `<p class="trip-events__msg">Loading...
  </p>`
);

export default class Loading extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return createLoadingTemplate();
  }
}

