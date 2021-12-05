import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto/auto.esm';

type ChartData = {
  labels: string[],
  datasets: {
    label: string,
    data: number[],
  }[],
};

type ChartProps = {
  chartData: ChartData,
};

const getConfig = (chartData: unknown) => {
  return {
    type: 'line',
    data: chartData,
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

export default function ChartComponent({ chartData } : ChartProps): JSX.Element {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<unknown>(null);

  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (ctx) {
      console.log(getConfig(chartData));
      // @ts-ignore
      chartRef.current = new Chart(ctx, getConfig(chartData));
    }
  },[]);
  return (
    <div className="chart">
      <canvas className="chart__canvas" ref={canvasRef}></canvas>
    </div>
  );
}
