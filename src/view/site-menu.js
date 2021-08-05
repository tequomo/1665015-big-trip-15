import { createNode } from '../utils/utils.js';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn  trip-tabs__btn--active" href="#">Table</a>
  <a class="trip-tabs__btn" href="#">Stats</a>
</nav>`);

export default class SiteMenu {
  constructor() {
    this._node = null;
  }

  getTemplate() {
    return createSiteMenuTemplate();
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
