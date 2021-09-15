import AbstractObserver from '../utils/abstract-observer.js';

export default class Points extends AbstractObserver {
  constructor() {
    super();
    this._points = [];
  }

  setPoints(updateType, points) {
    this._points = points.slice();
    this._notify(updateType);
  }

  getPoints() {
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

  static adaptToClient(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        eventType: point['type'],
        eventOffers: point['offers'],
        basePrice: point['base_price'],
        dateFrom: new Date(point['date_from']),
        dateTo: new Date(point['date_to']),
        isFavorite: point['is_favorite'],
      },
    );
    delete adaptedPoint['type'];
    delete adaptedPoint['offers'];
    delete adaptedPoint['is_favorite'];
    delete adaptedPoint['date_from'];
    delete adaptedPoint['date_to'];
    delete adaptedPoint['base_price'];

    return adaptedPoint;
  }

  static adaptToServer(point) {
    const adaptedPoint = Object.assign(
      {},
      point,
      {
        'date_from': point.dateFrom.toISOString(),
        'date_to': point.dateTo.toISOString(),
        'type': point.eventType,
        'base_price': point.basePrice,
        'is_favorite': point.isFavorite,
        'offers': point.eventOffers,
      },
    );

    delete adaptedPoint.dateFrom;
    delete adaptedPoint.dateTo;
    delete adaptedPoint.basePrice;
    delete adaptedPoint.isFavorite;
    delete adaptedPoint.eventType;
    delete adaptedPoint.eventOffers;

    return adaptedPoint;
  }
}
