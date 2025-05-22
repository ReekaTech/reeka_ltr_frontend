export interface MetricsCardProps {
    title: string
    value: string
    change: string
    changeType: "positive" | "negative" | "neutral"
    subtitle?: string
    bgColor?: string
}

export function MetricsCard({ title, value, change, changeType, subtitle, bgColor }: MetricsCardProps) {
    const getChangeColor = () => {
        switch (changeType) {
            case "positive":
                return "text-green-600"
            case "negative":
                return "text-red-600"
            default:
                return "text-gray-600"
        }
    }

    return (
        <div className={`rounded-lg border border-[#dcdcdc] bg-white p-4 shadow-sm ${bgColor || ""}`}>
            <h3 className="text-sm font-medium text-[#808080]">{title}</h3>
            {!value ? (
                <div className="mt-2 flex h-16 flex-col items-center justify-center text-center">
                    <div className="text-sm text-[#6d6d6d]">No data available</div>
                </div>
            ) : (
                <>
                    <div className="mt-2 text-2xl font-semibold">{value}</div>
                    {subtitle && <div className="mt-1 text-sm text-[#6d6d6d]">{subtitle}</div>}
                    <div className={`mt-2 text-sm ${getChangeColor()}`}>{change}</div>
                </>
            )}
        </div>
    )
}
  