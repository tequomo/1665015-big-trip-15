import PointsModel from '../model/points.js';
import { isOnline } from '../utils/common.js';

const getSyncedPoints = (items) =>
  items
    .filter(({success}) => success)
    .map(({payload}) => payload.point);

const createStoreStructure = (items) =>
  items
    .reduce((acc, current) => Object.assign({}, acc, {
      [current.id]: current,
    }), {});


export default class Provider {
  constructor(api, pointsStore, offersStore, destinationsStore) {
    this._api = api;
    this._pointsStore = pointsStore;
    this._offersStore = offersStore;
    this._destinationsStore = destinationsStore;
  }


  getPoints() {
    if(isOnline()) {
      return this._api.getPoints()
        .then((points) => {
          const items = createStoreStructure(points.map(PointsModel.adaptToServer));
          this._pointsStore.setItems(items);
          return points;
        });
    }

    const storedPoints = Object.values(this._pointsStore.getItems());

    return Promise.resolve(storedPoints.map(PointsModel.adaptToClient));
  }

  getOffers() {
    if(isOnline()) {
      return this._api.getOffers()
        .then((offers) => {
          this._offersStore.setItems(offers);
          return offers;
        });
    }

    const storedOffers = Object.values(this._offersStore.getItems());

    return Promise.resolve(storedOffers);
  }

  getDestinations() {
    if(isOnline()) {
      return this._api.getDestinations()
        .then((destinations) => {
          this._destinationsStore.setItems(destinations);
          return destinations;
        });
    }

    const storedDestinations = Object.values(this._destinationsStore.getItems());

    return Promise.resolve(storedDestinations);
  }

  getInitData() {
    return Promise.all([
      this.getPoints(),
      this.getOffers(),
      this.getDestinations(),
    ])
      .catch((err) => { throw new Error(err);});
  }

  updatePoint(point) {
    if(isOnline()) {
      return this._api.updatePoint(point)
        .then((updatedPoint) => {
          this._pointsStore.setItem(updatedPoint.id, PointsModel.adaptToServer(updatedPoint));
          return updatedPoint;
        });
    }

    this._pointsStore.setItem(point.id, PointsModel.adaptToServer(Object.assign({}, point)));

    return Promise.resolve(point);
  }

  addPoint(point) {
    if(isOnline()) {
      return this._api.addPoint(point)
        .then((newPoint) => {
          this._pointsStore.setItem(newPoint.id, PointsModel.adaptToServer(newPoint));
          return newPoint;
        });

    }

    return Promise.reject(new Error('Add point failed'));
  }

  deletePoint(point) {
    if(isOnline()) {
      return this._api.deletePoint(point)
        .then(() => {
          this._pointsStore.removeItem(point.id);
        });
    }

    return Promise.reject(new Error('Delete point failed'));
  }

  sync() {
    if(isOnline()) {
      const storedPoints = Object.values(this._pointsStore.getItems());

      this._api.sync(storedPoints)
        .then((response) => {
          const createdPoints = getSyncedPoints(response.created);
          const updatedPoints = getSyncedPoints(response.updated);

          const items = createStoreStructure([...createdPoints, ...updatedPoints]);

          this._pointsStore.setItems(items);
        });
    }

    return Promise.reject(new Error('Sync data failed'));
  }
}
