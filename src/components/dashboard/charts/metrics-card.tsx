export interface MetricsCardProps {
    title: string
    value: string
    change: string
    changeType: "positive" | "negative" | "neutral"
    subtitle?: string
    bgColor?: string
  }
  
  export function MetricsCard({ title, value, change, changeType, subtitle, bgColor = "bg-white" }: MetricsCardProps) {
    const changeColor =
      changeType === "positive" ? "#219653" : changeType === "negative" ? "#e90000" : "#6d6d6d"

      const gradientClass =
  changeType === "positive"
    ? "bg-[linear-gradient(to_right,_white_0%,_white_80%,_rgb(34,197,94,0.2)_100%)]"
    : changeType === "negative"
    ? "bg-[linear-gradient(to_right,_white_0%,_white_80%,_rgb(239,68,68,0.2)_100%)]"
    : "bg-[linear-gradient(to_right,_white_0%,_white_80%,_rgb(156,163,175,0.2)_100%)]";

  
    return (
      <div className={`rounded-lg shadow-md ${gradientClass} p-4`} >
        <div className="mb-4 flex items-center justify-between">
          <div className="text-sm text-[#6d6d6d]">{title}</div>
          <div className={`text-sm font-medium text-[${changeColor}]`}>{change}</div>
        </div>
        <div className="text-2xl font-semibold">{value}</div>
        {subtitle && <div className="mt-1 text-xs text-[#6d6d6d]">{subtitle}</div>}
      </div>
    )
  }
  