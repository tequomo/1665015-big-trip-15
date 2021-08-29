import { nanoid } from 'nanoid';
import { FormState, NEW_POINT, UpdateType, UserAction } from '../utils/const.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { isEscEvent } from '../utils/utils.js';
import PointAddEditView from '../view/point-add-edit.js';

export default class PointNew {
  constructor(pointContainer, changeData) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;

    this._pointAddEditComponent = null;
    this._formState = FormState.ADD;
    this._point = NEW_POINT;

    this._handleFormSubmit =this._handleFormSubmit.bind(this);
    this._handleButtonCancelClick = this._handleButtonCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init() {
    if(this._pointAddEditComponent !== null) {
      return;
    }

    this._pointAddEditComponent = new PointAddEditView(this._point, this._formState);
    this._pointAddEditComponent.setRangeDatepicker();
    this._pointAddEditComponent.setPriceChangeHandler();
    this._pointAddEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointAddEditComponent.setButtonDeleteClickHandler(this._handleButtonCancelClick);

    render(this._pointContainer, this._pointAddEditComponent, RenderPosition.AFTERBEGIN);

    document.addEventListener('keydown', this._escKeyDownHandler);
  }

  destroy() {
    if(this._pointAddEditComponent === null) {
      return;
    }

    remove(this._pointAddEditComponent);
    this._pointAddEditComponent.removeRangeDatePicker();
    this._pointAddEditComponent = null;

    document.removeEventListener('keydown', this._escKeyDownHandler);
  }

  _handleFormSubmit(point) {
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      Object.assign(
        {
          id: nanoid(),
        },
        point),
    );
    this.destroy();
  }

  _handleButtonCancelClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (isEscEvent(evt)) {
      evt.preventDefault();
      this.destroy();
      document.removeEventListener('keydown', this._escKeyDownHandler);
    }
  }
}