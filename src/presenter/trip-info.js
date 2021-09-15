import { remove, render, RenderPosition, replace } from '../utils/render.js';
import TripInfoView from '../view/trip-info.js';

export default class TripInfo {
  constructor(infoContainer, pointsModel) {
    this._infoContainer = infoContainer;
    this._pointsModel = pointsModel;

    this._tripInfoComponent = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._pointsModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._points = this._pointsModel.getPoints();

    if (this._points.length === 0) {
      if(this._tripInfoComponent) {
        remove(this._tripInfoComponent);
        this._tripInfoComponent = null;
      }
      return;
    }

    this._renderTripInfoComponent();
  }

  _renderTripInfoComponent() {

    const prevTripInfoComponent = this._tripInfoComponent;
    this._tripInfoComponent = new TripInfoView(this._points);

    if (prevTripInfoComponent === null) {
      render(this._infoContainer, this._tripInfoComponent, RenderPosition.AFTERBEGIN);
      return;
    }

    replace(this._tripInfoComponent, prevTripInfoComponent);
    remove(prevTripInfoComponent);
  }

  _handleModelEvent() {
    this.init();
  }
}
