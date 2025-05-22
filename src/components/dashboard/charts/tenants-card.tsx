interface TenantItemProps {
  name: string;
  status: "Paid" | "Delinquent";
  lastPaymentDate: string;
}

function TenantItem({ name, status, lastPaymentDate }: TenantItemProps) {
  const statusColor =
    status === "Paid" ? "text-[#219653] bg-[#ebfff3]" : "text-[#ff3b3b] bg-[#ffeeee]";

  return (
    <div className="border-b-1 border-[#eaeaea] py-4 last:border-b-0">
      <div className="flex items-center justify-between">
        <div className="font-extrabold text-sm text-[#3a3a3a]">{name}</div>
        <div className={`rounded-md px-2 py-1 text-xs font-medium ${statusColor}`}>{status}</div>
      </div>
      <div className="mt-1 text-xs text-[#6d6d6d]">Date of Last: {lastPaymentDate}</div>
    </div>
  );
}


interface Tenant {
  name: string;
  status: "Paid" | "Delinquent";
  lastPaymentDate: string;
}

interface TenantsCardProps {
  title?: string;
  tenants: Tenant[];
}

export function TenantsCard({ title = "Tenants", tenants }: TenantsCardProps) {
  return (
    <div className="rounded-lg border border-[#dcdcdc] bg-white shadow-sm">
      <div className="border-b-1 border-[#eaeaea] shadow-sm p-4">
        <h2 className="font-medium text-[#808080] text-base">{title}</h2>
      </div>

      <div className="p-4 h-[400px] overflow-y-auto">
        {tenants.map((tenant, index) => (
          <TenantItem
            key={index}
            name={tenant.name}
            status={tenant.status}
            lastPaymentDate={tenant.lastPaymentDate}
          />
        ))}
      </div>
    </div>
  );
}
