import AbstractObserver from '../utils/abstract-observer.js';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  set points(points) {
    this._points = points.slice();
  }

  get points() {
    return this._points;
  }

  updatePoint(updateType, updatedPoint) {
    const index = this._points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      updatedPoint,
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType, updatedPoint);
  }

  addPoint(updateType, updatedPoint) {
    this._points = [
      updatedPoint,
      ...this._points,
    ];

    this._notify(updateType, updatedPoint);
  }

  deletePoint(updateType, updatedPoint) {
    const index = this._points.findIndex((point) => point.id === updatedPoint.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting point');
    }

    this._points = [
      ...this._points.slice(0, index),
      ...this._points.slice(index + 1),
    ];

    this._notify(updateType);
  }
}
