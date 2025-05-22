"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui"
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LineElement,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
} from "chart.js"

import { AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui"
import { Line } from "react-chartjs-2"
import { useRef } from "react"

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Filler, Legend)

const THEME_COLOR = "#E36B37"
const THEME_COLOR_LIGHT = "rgba(227, 107, 55, 0.1)"
const THEME_COLOR_MEDIUM = "rgba(227, 107, 55, 0.5)"

interface BurnupChartProps {
  title?: string
  description?: string
  data: {
    dates: string[]
    actual: number[]
    ideal: number[]
  }
  target: number
  currency?: string
  className?: string
  showDeclines?: boolean
  summary?: {
    current: number
    target: number
    completion: number
  }
}

export default function BurnupChart({
  title = "Revenue Target",
  description = "Track your progress toward your revenue target",
  data,
  target,
  currency = "NGN",
  className = "",
  showDeclines = false,
  summary,
}: BurnupChartProps) {
  const chartRef = useRef<ChartJS<"line", number[], string>>(null)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const actualValues = data.actual.filter((v): v is number => v !== null)
  const currentValue = (summary?.current ?? actualValues[actualValues.length - 1]) || 0
  const completionPercentage = summary?.completion ?? Math.round((currentValue / target) * 100)

  const peakValue = Math.max(...actualValues)
  const peakIndex = actualValues.indexOf(peakValue)
  const peakMonth = new Date(data.dates[peakIndex]).toLocaleDateString("en-US", { month: "long" })
  const declineAmount = peakValue - currentValue
  const hasDeclined = declineAmount > 0

  const currentMonth = data.dates.length - 1
  const idealValue = data.ideal[currentMonth] || 0
  const isAhead = currentValue > idealValue
  const isBehind = currentValue < idealValue

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { month: "short" })

  const pointBackgroundColors = data.dates.map(() => THEME_COLOR)
  const pointBorderColors = data.dates.map(() => "#fff")
  const pointRadiuses = data.dates.map(() => 4)

  const declinePoints = actualValues.reduce<{ index: number; drop: number }[]>((acc, curr, i, arr) => {
    if (i > 0 && curr < arr[i - 1]) acc.push({ index: i, drop: arr[i - 1] - curr })
    return acc
  }, [])

  const chartData = {
    labels: data.dates.map(formatDate),
    datasets: [
      {
        fill: true,
        label: "Actual Progress",
        data: data.actual,
        borderColor: THEME_COLOR,
        backgroundColor: THEME_COLOR_LIGHT,
        borderWidth: 2,
        tension: 0.4,
        pointRadius: pointRadiuses,
        pointBackgroundColor: pointBackgroundColors,
        pointBorderColor: pointBorderColors,
        pointBorderWidth: 2,
        pointHoverRadius: 8,
      },
      {
        fill: false,
        label: "Ideal Progress",
        data: data.ideal,
        borderColor: "rgba(107, 114, 128, 0.5)",
        borderWidth: 2,
        borderDash: [5, 5],
        tension: 0,
        pointRadius: 0,
      },
      {
        fill: false,
        label: "Target",
        data: Array(data.dates.length).fill(target),
        borderColor: THEME_COLOR_MEDIUM,
        borderWidth: 2,
        pointRadius: 0,
        borderDash: [3, 3],
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top" as const,
        labels: { usePointStyle: true, boxWidth: 6, boxHeight: 6 },
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
        callbacks: {
          label: (ctx: any) => `${ctx.dataset.label}: ${formatCurrency(ctx.parsed.y)}`,
          title: (items: any) => new Date(data.dates[items[0].dataIndex]).toLocaleDateString("en-US", { month: "long", year: "numeric" }),
        },
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { maxRotation: 0, autoSkip: true, maxTicksLimit: 12 },
      },
      y: {
        min: 0,
        max: Math.max(target * 1.1, Math.max(...actualValues, ...data.ideal)),
        ticks: { callback: (v: any) => formatCurrency(v) },
        grid: { color: "rgba(0, 0, 0, 0.05)" },
      },
    },
  }

  const customPlugin = {
    id: "customPlugin",
    afterDraw: (chart: any) => {
      const { ctx, chartArea, scales } = chart
      const yAxis = scales.y
      const xAxis = scales.x
      const targetY = yAxis.getPixelForValue(target)

      if (targetY >= chartArea.top && targetY <= chartArea.bottom) {
        ctx.save()
        ctx.fillStyle = THEME_COLOR
        ctx.font = "bold 12px Arial"
        ctx.textAlign = "left"
        ctx.textBaseline = "bottom"
        ctx.fillText(`Target: ${formatCurrency(target)}`, chartArea.right - 120, targetY - 5)
        ctx.restore()
      }

      if (showDeclines && declinePoints.length > 0) {
        declinePoints.forEach(({ index, drop }) => {
          const x = xAxis.getPixelForValue(index)
          const y = yAxis.getPixelForValue(actualValues[index])
          ctx.save()
          ctx.fillStyle = "#ef4444"
          ctx.font = "bold 12px Arial"
          ctx.textAlign = "center"
          ctx.textBaseline = "bottom"
          ctx.fillText(`-${formatCurrency(drop)}`, x, y - 15)
          ctx.restore()
        })
      }
    },
  }

  return (
    <Card className={`overflow-hidden ${className} border border-[#dcdcdc]`}>
      <CardHeader className="pb-2" style={{ borderBottom: `1px solid ${THEME_COLOR_LIGHT}` }}>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle style={{ color: THEME_COLOR }}>{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
          {hasDeclined && showDeclines ? (
            <Badge variant="destructive" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span>Declined {formatCurrency(declineAmount)}</span>
            </Badge>
          ) : (
            <Badge
              variant={isAhead ? "default" : isBehind ? "destructive" : "outline"}
              style={{ backgroundColor: isAhead ? THEME_COLOR_LIGHT : undefined, color: isAhead ? THEME_COLOR : undefined, borderColor: isAhead ? THEME_COLOR : undefined }}>
              {isAhead ? "Ahead of Schedule" : isBehind ? "Behind Schedule" : "On Track"}
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {(!data.actual.length || !data.ideal.length) ? (
          <div className="flex h-[350px] flex-col items-center justify-center text-center">
            <div className="mb-2 text-[#6d6d6d]">No data available</div>
            <div className="text-sm text-[#808080]">Revenue data will appear here once available</div>
          </div>
        ) : (
          <>
            <div className="mb-4 grid grid-cols-3 gap-4">
              <div className="rounded-lg p-3" style={{ backgroundColor: THEME_COLOR_LIGHT }}>
                <p className="text-xs" style={{ color: THEME_COLOR }}>Current Progress</p>
                <p className="text-xl font-bold" style={{ color: THEME_COLOR }}>{formatCurrency(currentValue)}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Target</p>
                <p className="text-xl font-bold text-gray-700">{formatCurrency(target)}</p>
              </div>
              <div className="rounded-lg bg-gray-50 p-3">
                <p className="text-xs text-gray-500">Completion</p>
                <p className="text-xl font-bold text-gray-700">{completionPercentage}%</p>
              </div>
            </div>
            <div className="h-[350px]">
              <Line ref={chartRef} data={chartData} options={options} plugins={[customPlugin]} />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
