import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto/auto.esm';
import { ChartConfiguration, ChartData } from 'chart.js/types/index.esm';
import { TradesItem } from '../App';

const getChartData = (tradesItem: TradesItem): ChartData => ({
  labels: tradesItem.labels,
  datasets: [{
    label: tradesItem.name,
    data: tradesItem.data,
  }],
});

const getConfig = (tradesItem: TradesItem): ChartConfiguration => {
  return {
    type: 'line',
    data: getChartData(tradesItem),
    options: {
      responsive: true,
      interaction: {
        intersect: false,
      },
      scales: {
        x: {
          display: true,
          grid: {
            lineWidth: 0.5,
            borderColor: '#ffffff',
          },
          ticks: {
            autoSkipPadding: 16,
            maxRotation: 0,
            font: {
              family: 'Recursive',
              size: 10,
              weight: '300',
            },
            color: '#ffffff',
          },
        },
        y: {
          display: true,
          grid: {
            lineWidth: 0.5,
            borderColor: '#ffffff',
          },
          ticks: {
            autoSkipPadding: 16,
            font: {
              family: 'Recursive',
              size: 10,
              weight: '300',
            },
            color: '#ffffff',
          },
        }
      },
      elements: {
        line: {
          cubicInterpolationMode: 'monotone',
          fill: {
            target: 'origin',
            above: 'rgba(255, 212, 248, 0.05)',
          },
          borderWidth: 1,
          borderColor: '#ff00d6',
        },
        point: {
          radius: 2,
          hoverRadius: 4,
          borderColor: '#008c99',
          backgroundColor: 'rgba(255, 255, 255, 0.4)',
        },
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          titleFont: {
            family: 'Recursive',
          },
          bodyFont: {
            family: 'Recursive',
          },
          displayColors: false,
        },
      },
      animation: {
        duration: 0,
      },
    },
  };
};

function ChartComponent({ name, labels, data }: TradesItem): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      chartRef.current = new Chart(ctx, getConfig({ name, labels, data }));
    }
  },[]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.data = getChartData({ name, labels, data });
    chartRef.current.update();
  });

  return (
    <section className="box rounded p-3 mb-3">
      <h2 className="pb-3">{name} - USD</h2>
      <canvas className="chart__canvas" ref={canvasRef}></canvas>
    </section>
  );
}

const isEqual = (prevProps: TradesItem, nextProps: TradesItem) => {
  if (prevProps.labels.length !== nextProps.labels.length) return false;

  for (let i = 0; i <= prevProps.labels.length; i++) {
    if (prevProps.labels[i] !== nextProps.labels[i]) return false;
  }

  return true;
};

export default React.memo(ChartComponent, isEqual);
