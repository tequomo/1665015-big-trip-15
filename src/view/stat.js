import SmartView from './smart.js';
import flatpickr from 'flatpickr';
import rangePlugin from 'flatpickr/dist/plugins/rangePlugin';

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

export default class Stat extends SmartView {
  constructor(points) {
    super();
    this._data = {
      points,
    };
  }

  removeElement() {
    super.removeElement();
    this.removeRangeDatePicker();
  }

  getTemplate() {
    return createStatsTemplate(this._points);
  }

  setRangeDatepicker() {
    this.removeRangeDatePicker();

    this._rangeDatepicker = flatpickr(
      this.getElement().querySelector('#event-start-time-1'),
      {
        enableTime: true,
        dateFormat: 'd/m/y H:i',
        onClose: this._eventRangeChangeHandler,
        plugins: [new rangePlugin({ input: this.getElement().querySelector('#event-end-time-1')})],
      },
    );
  }

  removeRangeDatePicker() {
    if (this._rangeDatepicker) {
      this._rangeDatepicker.destroy();
      this._rangeDatepicker = null;
    }
  }
}
