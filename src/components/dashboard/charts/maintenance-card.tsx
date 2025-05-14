interface MaintenanceItemProps {
  issue: string;
  tenant: string;
  property: string;
  timeAgo: string;
}

function MaintenanceItem({ issue, tenant, property, timeAgo }: MaintenanceItemProps) {
  return (
    <div className="border-b-1 border-[#eaeaea] py-4 last:border-b-0">
      <div className="font-bold text-sm">{issue}</div>
      <div className="mt-1 flex flex-col justify-between sm:flex-row text-xs">
        <div className="flex gap-4">
          <div className="text-sm text-[#6d6d6d]">Tenant: <span className="font-bold">{tenant}</span></div>
          <div className="text-xs text-[#6d6d6d]">Property: {property}</div>
        </div>
        <div className="mt-1 text-right text-[10px] font-light text-[#6d6d6d] sm:mt-0">{timeAgo}</div>
      </div>
    </div>
  );
}


interface MaintenanceCardProps {
  title?: string;
  items: MaintenanceItemProps[];
}

export function MaintenanceCard({ title = "Maintenance", items }: MaintenanceCardProps) {
  return (
    <div className="rounded-lg border border-[#dcdcdc] bg-white shadow-sm">
      <div className="border-b-[0-3] shadow-sm border-[#eaeaea] p-4">
        <h2 className="font-medium text-[#808080] text-base">{title}</h2>
      </div>

      <div className="p-4">
        {items.map((item, index) => (
          <MaintenanceItem
            key={index}
            issue={item.issue}
            tenant={item.tenant}
            property={item.property}
            timeAgo={item.timeAgo}
          />
        ))}
      </div>
    </div>
  );
}
