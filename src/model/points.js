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

}
