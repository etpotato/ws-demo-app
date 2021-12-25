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
          title: {
            display: true
          }
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Value'
          },
        }
      }
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
    <div className="box rounded">
      <h2>{name} - USD</h2>
      <canvas className="chart__canvas" ref={canvasRef}></canvas>
    </div>
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
