'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LinearScale,
  Tooltip,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';
import { useMemo } from 'react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

interface MiniBarChartCardProps {
  title: string;
  currentValue: string;
  goalText: string;
  chartColor?: string;
  progressPercent: number; // e.g. 0.45
  completionLabel: string;
  remainingLabel: string;
  values?: number[]; 
  target?: number;
}

export function MiniBarChartCard({
  title,
  currentValue,
  goalText,
  chartColor = 'rgba(227, 107, 55, 0.8)',
  progressPercent,
  completionLabel,
  remainingLabel,
  values,
  target,
}: MiniBarChartCardProps) {
  const barData = useMemo(() => {
    const bars = 100;
    const height = 80;

    const generatedValues =
      values ??
      Array.from({ length: bars }, (_, i) => {
        const base = height * 0.3;
        const wave = Math.sin(i * 0.1) * height * 0.15;
        const noise = (Math.random() * 2 - 1) * height * 0.2;
        return Math.max(10, Math.min(80, base + wave + noise));
      });

    return {
      labels: generatedValues.map((_, i) => i.toString()),
      datasets: [
        {
          data: generatedValues,
          backgroundColor: chartColor,
          borderRadius: 1,
          barThickness: 2,
        },
      ],
    };
  }, [chartColor, values]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: { display: false },
      y: { display: false },
    },
    plugins: {
      legend: { display: false },
      tooltip: { enabled: false },
    },
  };

  return (
    <div className="rounded-lg border border-[#dcdcdc] bg-white shadow-sm">
      <div className="border-b border-[#dcdcdc] p-4">
        <h2 className="font-medium text-[#808080] text-base">{title}</h2>
      </div>

      <div className="p-4">
        <div className="mb-1 text-base font-semibold">{currentValue}</div>
        <div className="mb-4 text-xs text-[#6d6d6d]">{goalText}</div>

        <div className="relative h-[120px] w-full overflow-hidden">
          <Bar data={barData} options={options} />

          {/* Progress Marker Line */}
          <div className="pointer-events-none absolute inset-0">
            <div
              className="absolute h-full w-[2px] bg-[#e36b37]"
              style={{ left: `${progressPercent * 100}%` }}
            />
          </div>

          {/* Completion text */}
          <div className="absolute top-0 right-0 text-right">
            <div className="text-sm font-medium">{completionLabel}</div>
            <div className="text-xs font-extrabold text-[#6d6d6d]">{remainingLabel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
