import AbstractView from './abstract.js';

const statsType = [
  'money',
  'type',
  'time-spend',
];

const createStatsItem = () => `${statsType.map((type) =>`<div class="statistics__item">
  <canvas class="statistics__chart" id="${type}" width="900"></canvas>
</div>`).join('\n\n')}`;

// const createStatsTemplate = () => (
//   `<section class="statistics">
//     <h2 class="visually-hidden">Trip statistics</h2>

//     <div class="statistics__item">
//       <canvas class="statistics__chart" id="money" width="900"></canvas>
//     </div>

//     <div class="statistics__item">
//       <canvas class="statistics__chart" id="type" width="900"></canvas>
//     </div>

//     <div class="statistics__item">
//       <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
//     </div>
//   </section>`
// );

const createStatsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

      ${createStatsItem()}
  </section>`
);

export default class Stat extends AbstractView {
  constructor(points) {
    super();
    this._points = points;
  }

  getTemplate() {
    return createStatsTemplate(this._points);
  }
}
