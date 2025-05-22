import { DonutChart } from "./donut-chart"

interface UnitTypeProps {
  color: string;
  label: string;
  value: string;
  percentage: string;
}

function UnitType({ color, label, value }: UnitTypeProps) {
  return (
    <div className="flex flex-col gap-1 rounded-lg bg-[#fafafa] p-4">
      <div className="flex items-center gap-2">
        <div className={`h-1.5 w-4 rounded-sm ${color}`}></div>
        <div className="text-sm text-[#6d6d6d]">{label}</div>
      </div>
      <div className="ml-7 text-base font-bold text-[#3a3a3a]">{value}</div>
    </div>
  );
}

interface UnitData {
  label: string;
  value: number;
  color: string;
  twColor: string;
}

interface UnitsCardProps {
  title?: string;
  totalLabel?: string;
  totalValue: number;
  data: UnitData[];
}

export function UnitsCard({ title = "Units", totalLabel = "Total Value", totalValue, data }: UnitsCardProps) {
  const donutData = data.map(({ value, color }) => ({ value, color }));

  return (
    <div className="rounded-lg border border-[#dcdcdc] bg-white shadow-sm">
      <div className="p-4">
        <h2 className="font-medium text-[#808080] text-base">{title}</h2>
      </div>

      <div className="p-4">
        {data.length === 0 ? (
          <div className="flex h-48 flex-col items-center justify-center text-center">
            <div className="mb-2 text-[#6d6d6d]">No unit data available</div>
            <div className="text-sm text-[#808080]">Unit data will appear here once available</div>
          </div>
        ) : (
          <>
            {/* Chart and Legend Container */}
            <div className="mb-8 flex flex-col items-center gap-8 sm:flex-row sm:items-center sm:justify-between">
              {/* Donut Chart */}
              <div className="relative h-48 w-48">
                <DonutChart data={donutData} />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-xs text-[#6d6d6d]">{totalLabel}</div>
                  <div className="text-2xl font-semibold">{totalValue}</div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex flex-col space-y-4 sm:pr-8">
                {data.map(({ label, color, value }) => {
                  const total = data.reduce((acc, d) => acc + d.value, 0);
                  const percent = ((value / total) * 100).toFixed(0) + "%";
                  return (
                    <div key={label} className="flex items-center justify-between gap-6">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-4 rounded-sm" style={{ backgroundColor: color }}></div>
                        <span className="text-sm text-[#6d6d6d]">{label}</span>
                      </div>
                      <span className="w-12 text-right text-sm font-medium text-[#3a3a3a]">{percent}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Unit Type Cards */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {data.map(({ label, value, twColor }) => (
                <UnitType
                  key={label}
                  label={label}
                  value={value.toString()}
                  percentage=""
                  color={twColor}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

