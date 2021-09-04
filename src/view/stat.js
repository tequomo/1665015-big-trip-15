import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { getCostByType, getColor, getLigthenColors, getPointTypes, getCountByType, getTravelTimeByType, sortLabelsByIndex } from '../utils/stat.js';
import { formatDuration } from '../utils/common.js';


const BAR_HEIGHT = 55;


const renderMoneyChart = (moneyCtx, data) => {
  const {pointTypes, labels, randomColors, randomLightenColors, costByType} = data;

  const sortedData = sortLabelsByIndex(labels, costByType);

  moneyCtx.height = BAR_HEIGHT * pointTypes.length;

  return new Chart(moneyCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...sortedData.keys()],
      datasets: [{
        data: [...sortedData.values()],
        backgroundColor: randomColors,
        hoverBackgroundColor: randomLightenColors,
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `€ ${val}`,
        },
      },
      title: {
        display: true,
        text: 'MONEY',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTypeChart = (typeCtx, data) => {
  const {pointTypes, labels, randomColors, randomLightenColors, countByType} = data;

  const sortedData = sortLabelsByIndex(labels, countByType);

  typeCtx.height = BAR_HEIGHT * pointTypes.length;

  new Chart(typeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...sortedData.keys()],
      datasets: [{
        data: [...sortedData.values()],
        backgroundColor: randomColors,
        hoverBackgroundColor: randomLightenColors,
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${val}x`,
        },
      },
      title: {
        display: true,
        text: 'TYPE',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const renderTimeSpendChart = (timeCtx, data) => {
  const {pointTypes, labels, randomColors, randomLightenColors, travelTimeByType} = data;

  const sortedData = sortLabelsByIndex(labels, travelTimeByType);

  timeCtx.height = BAR_HEIGHT * pointTypes.length;

  return new Chart(timeCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: [...sortedData.keys()],
      datasets: [{
        data: [...sortedData.values()],
        backgroundColor: randomColors,
        hoverBackgroundColor: randomLightenColors,
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: (val) => `${formatDuration(val)}`,
        },
      },
      title: {
        display: true,
        text: 'TIME-SPEND',
        fontColor: '#000000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createStatsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time-spend" width="900"></canvas>
    </div>
  </section>`
);


export default class Stat extends SmartView {
  constructor(points) {
    super();

    this._points = points;

    const pointTypes = getPointTypes(this._points);
    const labels = pointTypes.map((type) => type.toUpperCase());
    const randomColors = pointTypes.map(() => getColor());
    const randomLightenColors = getLigthenColors(randomColors);
    const costByType = getCostByType(pointTypes, this._points);
    const countByType = getCountByType(pointTypes, this._points);
    const travelTimeByType = getTravelTimeByType(pointTypes,this._points);


    this._data = {
      pointTypes,
      labels,
      randomColors,
      randomLightenColors,
      costByType,
      countByType,
      travelTimeByType,
    };

    this._moneyChart = null;
    this._typeChart = null;
    this._timeChart = null;

    this._setCharts();
  }

  removeElement() {
    super.removeElement();
  }

  getTemplate() {
    return createStatsTemplate();
  }

  restoreHandlers() {
    this._setCharts();
  }

  _setCharts() {
    if (this._moneyChart !== null || this._typeChart !== null || this._timeChart !== null) {
      this._moneyChart = null;
      this._typeChart = null;
      this._timeChart = null;
    }

    const moneyCtx = this.getElement().querySelector('#money');
    const typeCtx = this.getElement().querySelector('#type');
    const timeCtx = this.getElement().querySelector('#time-spend');

    this._moneyChart = renderMoneyChart(moneyCtx, this._data);
    this._typeChart = renderTypeChart(typeCtx, this._data);
    this._timeChart = renderTimeSpendChart(timeCtx, this._data);
  }
}
