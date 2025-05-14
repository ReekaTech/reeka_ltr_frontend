'use client';

import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip,
} from 'chart.js';

import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export interface DonutChartData {
  value: number;
  color: string;
  label?: string;
}

interface DonutChartProps {
  data: DonutChartData[];
  cutout?: string; // e.g. '60%' (default), or '70px'
  showLegend?: boolean;
}

export function DonutChart({
  data,
  cutout = '75%',
  showLegend = false,
}: DonutChartProps) {
  const chartData = {
    labels: data.map((d) => d.label || ''),
    datasets: [
      {
        data: data.map((d) => d.value),
        backgroundColor: data.map((d) => d.color),
        borderWidth: 0,
      },
    ],
  };

  const options = {
    cutout,
    plugins: {
      legend: {
        display: showLegend,
      },
      tooltip: {
        enabled: true,
      },
    },
    responsive: true,
    maintainAspectRatio: false,
  };

  return (
    <div className="relative h-[200px] w-[200px]">
      <Doughnut data={chartData} options={options} />
    </div>
  );
}
