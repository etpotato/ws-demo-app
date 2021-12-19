import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto/auto.esm';
import { ChartConfiguration, ChartData } from 'chart.js/types/index.esm';
import { TradesItem } from '../App';

interface Props {
  tradesItem: TradesItem,
}

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


export default function ChartComponent({ tradesItem }: Props): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      chartRef.current = new Chart(ctx, getConfig(tradesItem));
    }
  },[]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.data = getChartData(tradesItem);
    chartRef.current?.update();
  }, [tradesItem.data.length]);

  return (
    <div className="chart">
      <h2>{tradesItem.name} - USD</h2>
      <canvas className="chart__canvas" ref={canvasRef}></canvas>
    </div>
  );
}
