import dayjs from 'dayjs';

const getDuration = (start, end) => {
  const diffInMinutes = (dayjs(end)).diff(dayjs(start), 'minutes');
  const hours = Math.floor(diffInMinutes / 60);
  const minutes = diffInMinutes - (hours * 60);
  const days = Math.floor(hours / 24);

  return `${(days !== 0) ? `${days}D` : ''} ${(hours !== 0) ? `${hours}H` : ''} ${minutes}M`;
};

// const showSelectedOffers = (offers) => {
//   let selectedOffers = `<h4 class="visually-hidden">Offers:</h4>
//   <ul class="event__selected-offers">`;
//   for (const offer of offers) {
//     const { title, price } = offer;
//     selectedOffers += `<li class="event__offer">
//     <span class="event__offer-title">${title}</span>
//     &plus;&euro;&nbsp;
//     <span class="event__offer-price">${price}</span>
//   </li>`;
//   }
//   selectedOffers += '</ul>';
//   return selectedOffers;
// };

const showOffers = (offers) => ((offers.length !== 0) ? (`<h4 class="visually-hidden">Offers:</h4>
  <ul class="event__selected-offers">
  ${offers.map((offer) =>
    `<li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>`).join('\n')}
  </ul>`) : '');

export const createShowPointTemplate = (point) => {
  const { basePrice, dateFrom, dateTo, eventType, isFavorite, eventOffers, destination: { name } } = point;
  const eventDate = dayjs(dateFrom).format('YYYY-MM-DD');
  const shortEventDate = dayjs(dateFrom).format('MMM DD');
  const startTime = dayjs(dateFrom).format('YYYY-MM-DD[T]HH:mm');
  const shortStartTime = dayjs(dateFrom).format('HH:mm');
  const endTime = dayjs(dateTo).format('YYYY-MM-DD[T]HH:mm');
  const shortEndTime = dayjs(dateTo).format('HH:mm');

  return `<li class="trip-events__item">
    <div class="event">
      <time class="event__date" datetime="${eventDate}">${shortEventDate}</time>
      <div class="event__type">
        <img class="event__type-icon" width="42" height="42" src="img/icons/${eventType.toLowerCase()}.png" alt="Event type icon">
      </div>
      <h3 class="event__title">${eventType} ${name}</h3>
      <div class="event__schedule">
        <p class="event__time">
          <time class="event__start-time" datetime="${startTime}">${shortStartTime}</time>
          &mdash;
          <time class="event__end-time" datetime="${endTime}">${shortEndTime}</time>
        </p>
        <p class="event__duration">${getDuration(dateFrom, dateTo)}</p>
      </div>
      <p class="event__price">
        &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
      </p>
      ${showOffers(eventOffers)}
      <button class="event__favorite-btn ${(isFavorite) ? 'event__favorite-btn--active' : ''}" type="button">
        <span class="visually-hidden">Add to favorite</span>
        <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
          <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
        </svg>
      </button>
      <button class="event__rollup-btn" type="button">
        <span class="visually-hidden">Open event</span>
      </button>
    </div>
  </li>`;
};
