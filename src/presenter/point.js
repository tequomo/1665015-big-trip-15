import PointView from '../view/point.js';
import PointAddEditView from '../view/point-add-edit.js';
import { isEscEvent } from '../utils/utils.js';
import { remove, render, RenderPosition, replace } from '../utils/render.js';
import { FormState, Mode, ProcessingState, UpdateType, UserAction } from '../utils/const.js';
import { isDatesEqual, isOnline } from '../utils/common.js';
import { toast } from '../utils/toast.js';

export default class Point {
  constructor(pointContainer, changeData, changeMode, offersModel, destinationsModel) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._pointComponent = null;
    this._pointAddEditComponent = null;
    this._mode = Mode.DEFAULT;
    this._formState = FormState.DEFAULT;

    this._handleButtonPointClick = this._handleButtonPointClick.bind(this);
    this._handleButtonEditClick = this._handleButtonEditClick.bind(this);
    this._handleButtonDeleteClick = this._handleButtonDeleteClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._handleFavoriteButtonClick = this._handleFavoriteButtonClick.bind(this);
  }

  init(point) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointAddEditComponent = this._pointAddEditComponent;

    this._pointComponent = new PointView(this._point);
    this._pointAddEditComponent = new PointAddEditView(this._point, this._offersModel, this._destinationsModel, this._formState);

    this._pointComponent.setButtonClickHandler(this._handleButtonPointClick);
    this._pointComponent.setFavoriteButtonClickHandler(this._handleFavoriteButtonClick);
    this._pointAddEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointAddEditComponent.setButtonClickHandler(this._handleButtonEditClick);
    this._pointAddEditComponent.setButtonDeleteClickHandler(this._handleButtonDeleteClick);
    this._pointAddEditComponent.setPriceChangeHandler();

    if (prevPointComponent === null || prevPointAddEditComponent === null) {
      render(this._pointContainer, this._pointComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointComponent, prevPointAddEditComponent);
      this._mode = Mode.DEFAULT;
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

  setProcessingState(state) {
    if (this._mode === Mode.DEFAULT) {
      return;
    }

    const resetEditFormState = () => {
      this._pointAddEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    switch (state) {
      case ProcessingState.SAVING:
        this._pointAddEditComponent.updateData({
          isDisabled: true,
          isSaving: true,
        });
        break;
      case ProcessingState.DELETING:
        this._pointAddEditComponent.updateData({
          isDisabled: true,
          isDeleting: true,
        });
        break;
      case ProcessingState.ABORTING:
        this._pointAddEditComponent.shake(resetEditFormState);
        break;
    }
  }

  _replacePointToEditForm() {
    replace(this._pointAddEditComponent, this._pointComponent);
    this._pointAddEditComponent.setRangeDatepicker();
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.EDITING;
  }

  _replaceEditFormToPoint() {
    replace(this._pointComponent, this._pointAddEditComponent);
    this._pointAddEditComponent.removeRangeDatePicker();
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
    if (!isOnline()) {
      toast('You can\'t edit point offline');

      this._pointComponent.shake();
      return;
    }
    this._replacePointToEditForm();
  }

  _handleButtonEditClick() {
    this._replaceEditFormToPoint();
  }

  _handleButtonDeleteClick(point) {
    if (!isOnline()) {
      toast('You can\'t delete point offline');
      this._pointAddEditComponent.shake();
      return;
    }
    this._changeData(
      UserAction.DELETE_POINT,
      UpdateType.MINOR,
      point,
    );
  }

  _handleFormSubmit(update) {
    if (!isOnline()) {
      toast('You can\'t save point offline');
      this._pointAddEditComponent.shake();
      return;
    }
    const isMinorUpdate =
      !isDatesEqual(this._point.dateFrom, update.dateFrom) ||
      !isDatesEqual(this._point.dateTo, update.dateTo);
    this._changeData(
      UserAction.UPDATE_POINT,
      isMinorUpdate ? UpdateType.MINOR : UpdateType.PATCH,
      update,
    );
  }

  _handleFavoriteButtonClick() {
    this._changeData(
      UserAction.UPDATE_POINT,
      UpdateType.PATCH,
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
