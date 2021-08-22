import PointView from '../view/point.js';
import PointAddEditView from '../view/point-add-edit.js';
import { isEscEvent } from '../utils/utils.js';
import { remove, render, RenderPosition, replace } from '../utils/render.js';
import { FormState, Mode } from '../utils/const.js';

export default class Point {
  constructor(pointContainer, changeData, changeMode) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointAddEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._formState = FormState.DEFAULT;

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
    this._pointAddEditComponent = new PointAddEditView(this._point, this._formState);

    this._pointComponent.setButtonClickHandler(this._handleButtonPointClick);
    this._pointComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);
    this._pointAddEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointAddEditComponent.setButtonClickHandler(this._handleButtonEditClick);

    if(prevPointComponent === null || prevPointAddEditComponent === null) {
      render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if(this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if(this._mode === Mode.EDITING) {
      replace(this._pointAddEditComponent, prevPointAddEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointAddEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointAddEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceEditFormToPoint();
    }
  }

  _replacePointToEditForm() {
    replace(this._pointAddEditComponent, this._pointComponent);
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditFormToPoint() {
    replace(this._pointComponent, this._pointAddEditComponent);
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._mode = Mode.DEFAULT;
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

  _handleFormSubmit(point) {
    this._changeData(point);
    this._replaceEditFormToPoint();
  }

  _handleFavoriteButtonClick() {
    this._changeData(
      Object.assign(
        {},
        this._point,
        {
          isFavorite: !this._point.isFavorite,
        },
      ),
    );
  }
}
