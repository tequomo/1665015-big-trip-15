import PointsModel from '../model/points.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

const DataPath = {
  POINTS: 'points',
  DESTINATIONS: 'destinations',
  OFFERS: 'offers',
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getPoints() {
    return this._load({url: DataPath.POINTS})
      .then(Api.toJSON)
      .then((points) => points.map(PointsModel.adaptToClient));
  }

  getOffers() {
    return this._load({url: DataPath.OFFERS})
      .then(Api.toJSON);
  }

  getDestinations() {
    return this._load({url: DataPath.DESTINATIONS})
      .then(Api.toJSON);
  }

  getInitData() {
    return Promise.all([
      this.getPoints().catch((err) => { throw new Error(err);}),
      this.getOffers().catch((err) => { throw new Error(err);}),
      this.getDestinations().catch((err) => { throw new Error(err);}),
    ]);
  }

  updatePoint(point) {
    return this._load({
      url: `${DataPath.POINTS}/${point.id}`,
      method: Method.PUT,
      body: JSON.stringify(PointsModel.adaptToServer(point)),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON)
      .then(PointsModel.adaptToClient);
  }

  _load({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (!response.ok) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }
    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
