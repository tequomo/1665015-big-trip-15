const getTripCost = (sum, point) => sum + point.basePrice + point.eventOffers.reduce((acc, offer) => acc + offer.price, 0);


export const createTripCostTemplate = (points) => `<p class="trip-info__cost">
  Total: &euro;&nbsp;<span class="trip-info__cost-value">${(points.length !== 0) ? points.reduce(getTripCost, 0) : 0}</span>
  </p>`;
