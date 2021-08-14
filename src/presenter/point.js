import PointView from '../view/point.js';
import PointAddEditView from '../view/point-add-edit.js';
import { isEscEvent } from '../utils/utils.js';
import { render, RenderPosition, replace } from '../utils/render.js';


export default class Point {
  constructor(pointContainer) {
    this._pointContainer = pointContainer;

    this._handleButtonPointClick = this._handleButtonPointClick.bind(this);
    this._handleButtonEditClick = this._handleButtonEditClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point) {
    this._point = point;
    this._pointComponent = new PointView(this._point);
    this._pointAddEditComponent = new PointAddEditView(this._point, true);

    this._pointComponent.setButtonClickHandler(this._handleButtonPointClick);
    this._pointAddEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointAddEditComponent.setButtonClickHandler(this._handleButtonEditClick);

    render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
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
}
