import { isOnline } from '../utils/common.js';
import { FormState, NEW_POINT, UpdateType, UserAction } from '../utils/const.js';
import { remove, render, RenderPosition } from '../utils/render.js';
import { toast } from '../utils/toast.js';
import { isEscEvent } from '../utils/utils.js';
import PointAddEditView from '../view/point-add-edit.js';

export default class PointNew {
  constructor(pointContainer, changeData, offersModel, destinationsModel) {
    this._pointContainer = pointContainer;
    this._changeData = changeData;

    this._offersModel = offersModel;
    this._destinationsModel = destinationsModel;

    this._pointAddEditComponent = null;
    this._formState = FormState.ADD;
    this._point = NEW_POINT;
    this._unsetCallback = null;

    this._handleFormSubmit =this._handleFormSubmit.bind(this);
    this._handleButtonCancelClick = this._handleButtonCancelClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback) {
    this._unsetCallback = callback;
    if(this._pointAddEditComponent !== null) {
      return;
    }

    this._pointAddEditComponent = new PointAddEditView(this._point, this._offersModel, this._destinationsModel, this._formState);
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

    if(this._unsetCallback !== null) {
      this._unsetCallback();
    }

    document.removeEventListener('keydown', this._escKeyDownHandler);
    // removeAnimationCSS();
  }

  setSaving() {
    this._pointAddEditComponent.updateData({
      isDisabling: true,
      isSaving: true,
    });
  }

  setAborting() {
    const resetAddFormState = () => {
      this._pointAddEditComponent.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false,
      });
    };

    this._pointAddEditComponent.shake(resetAddFormState);
  }

  _handleFormSubmit(point) {
    if (!isOnline()) {
      toast('You can\'t save point offline');
      this._pointAddEditComponent.shake();
      return;
    }
    this._changeData(
      UserAction.ADD_POINT,
      UpdateType.MINOR,
      point,
    );
    // this.destroy();
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
