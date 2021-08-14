import PointView from '../view/point.js';
import PointAddEditView from '../view/point-add-edit.js';
import { isEscEvent } from '../utils/utils.js';
import { remove, render, RenderPosition, replace } from '../utils/render.js';


export default class Point {
  constructor(pointContainer) {
    this._pointContainer = pointContainer;

    this._pointComponent = null;
    this._pointAddEditComponent = null;

    this._handleButtonPointClick = this._handleButtonPointClick.bind(this);
    this._handleButtonEditClick = this._handleButtonEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointAddEditComponent = this._pointAddEditComponent;

    this._pointComponent = new PointView(this._point);
    this._pointAddEditComponent = new PointAddEditView(this._point, true);

    this._pointComponent.setButtonClickHandler(this._handleButtonPointClick);
    this._pointComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);
    this._pointAddEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointAddEditComponent.setButtonClickHandler(this._handleButtonEditClick);

    if(prevPointComponent === null || prevPointAddEditComponent === null) {
      render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if(this._pointContainer.getElement().contains(prevPointComponent.getElement())) {
      replace(this._pointComponent, prevPointComponent);
    }

    if(this._pointContainer.getElement().contains(prevPointAddEditComponent.getElement())) {
      replace(this._pointAddEditComponent, prevPointAddEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointAddEditComponent);
  }

  _destroy() {
    remove(this._pointComponent);
    remove(this._pointAddEditComponent);
  }

  _replacePointToEditForm() {
    replace(this._pointAddEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  _replaceEditFormToPoint() {
    replace(this._pointComponent, this._pointAddEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this._replaceEditFormToPoint();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }

  _handleButtonPointClick() {
    this._replacePointToEditForm();
  }

  _handleButtonEditClick() {
    this._replaceEditFormToPoint();
  }

  _handleFormSubmit() {
    this._replaceEditFormToPoint();
  }

  _handleFavoriteButtonClick() {
    console.log('clicked!');
  }
}
