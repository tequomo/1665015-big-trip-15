import dayjs from 'dayjs';

const getTripRoute = (points) => `<p class="trip-info__dates">${dayjs(points[0].dateFrom).format('MMM DD')}&nbsp;&mdash;&nbsp;${dayjs([...points].pop().dateTo).format('MMM DD')}</p>`;

const getTripChain = (points) => `<h1 class="trip-info__title">${(points.length <= 3) ? points.map((point) => point.destination.name).join(' &mdash; ') : `${points[0].destination.name} &mdash; ... &mdash; ${[...points].pop().destination.name}`}</h1>`;


export const createTripInfoTemplate = (points) => (points.length !== 0) ? `<section class="trip-main__trip-info  trip-info">
    <div class="trip-info__main">
      ${getTripChain(points)}

      ${getTripRoute(points)}
    </div>
  </section>` : '';
