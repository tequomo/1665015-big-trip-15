import AbstractView from './abstract.js';
import { MenuItem } from '../utils/const.js';

const createSiteMenuTemplate = () => (
  `<nav class="trip-controls__trip-tabs  trip-tabs">
  <a class="trip-tabs__btn trip-tabs__btn--active" href="#" data-menu-item="${MenuItem.TABLE}">${MenuItem.TABLE}</a>
  <a class="trip-tabs__btn" href="#" data-menu-item="${MenuItem.STATS}">${MenuItem.STATS}</a>
</nav>`);

export default class SiteMenu extends AbstractView {
  constructor(menuItem) {
    super();

    this._menuItem = menuItem;
    this._menuClickHandler = this._menuClickHandler.bind(this);
  }


  getTemplate() {
    return createSiteMenuTemplate();
  }

  _menuClickHandler(evt) {
    evt.preventDefault();
    const selectedItem = evt.target.dataset.menuItem;

    if (evt.target.tagName !== 'A') {
      return;
    }

    if(selectedItem === this._menuItem) {
      return;
    }

    this._menuItem = selectedItem;
    const items =  this.getElement().querySelectorAll('.trip-tabs__btn');
    [...items].map((item) => item.classList.toggle('trip-tabs__btn--active'));

    this._callback.menuClick(selectedItem);
  }

  setMenuClickHandler(callback) {
    this._callback.menuClick = callback;
    this.getElement().addEventListener('click', this._menuClickHandler);
  }

  setMenuItem(menuItem) {
    const selectedItem = this.getElement().querySelector(`[data-menu-item=${menuItem}]`);

    if (selectedItem !== null) {
      selectedItem.classList.toggle('trip-tabs__btn--active');
    }
  }
}
