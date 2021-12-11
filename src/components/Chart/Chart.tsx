import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto/auto.esm';
import { ChartConfiguration, ChartData } from 'chart.js/types/index.esm';
import { tradesItem } from '../App';

interface Trades {
  timestamps: string[],
  currencies: tradesItem,
}

interface Props {
  trades: Trades,
}

const getChartData = (trades: Trades): ChartData => {
  const datasets = Object.keys(trades.currencies)
    .map((item: string) => ({
      label: trades.currencies[item].name,
      data: trades.currencies[item].prices,
    }));
  return {
    labels: [...trades.timestamps],
    datasets,
  };
};

const getConfig = (trades: Trades): ChartConfiguration => {
  return {
    type: 'line',
    data: getChartData(trades),
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Chart.js Line Chart - Cubic interpolation mode'
        },
      },
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


export default function ChartComponent({ trades }: Props): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<any>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      chartRef.current = new Chart(ctx, getConfig(trades));
    }
  },[]);

  useEffect(() => {
    if (!chartRef.current) return;
    chartRef.current.data = getChartData(trades);
    chartRef.current?.update();
  }, [trades]);

  return (
    <div className="chart">
      <canvas className="chart__canvas" ref={canvasRef}></canvas>
    </div>
  );
}
