interface ExpensesTabProps {
  searchTerm: string;
}

// Sample expenses data
const expenses = [
  {
    id: '1',
    name: 'Air condition Repair',
    date: '24-1-2026',
    property: 'Ama Nest',
    type: 'Maintenance',
    amount: '₦1,000,000',
  },
  {
    id: '2',
    name: 'Olowo Balogun',
    date: '24-1-2026',
    property: 'Bancroft Hosing',
    type: 'Utilities',
    amount: '₦50,000',
  },
  {
    id: '3',
    name: 'Olowo Balogun',
    date: '24-1-2026',
    property: 'Bancroft Hosing',
    type: 'Miscellaneous',
    amount: '₦40,000',
  },
  {
    id: '4',
    name: 'Olowo Balogun',
    date: '24-1-2026',
    property: 'Bancroft Hosing',
    type: 'Insurance',
    amount: '₦450,000',
  },
  {
    id: '5',
    name: 'Olowo Balogun',
    date: '24-1-2026',
    property: 'Waterfield Estate',
    type: 'Taxes',
    amount: '₦1,000,000',
  },
  {
    id: '6',
    name: 'Olowo Balogun',
    date: '24-1-2026',
    property: 'Waterfield Estate',
    type: 'Insurance',
    amount: '₦50,000',
  },
  {
    id: '7',
    name: 'Olowo Balogun',
    date: '24-1-2026',
    property: 'Zest Housing',
    type: 'Utilities',
    amount: '₦1,000,000',
  },
  {
    id: '8',
    name: 'Olowo Balogun',
    date: '24-1-2026',
    property: 'Zest Housing',
    type: 'Utilities',
    amount: '₦450,000',
  },
  {
    id: '9',
    name: 'Olowo Balogun',
    date: '24-1-2026',
    property: 'Ama Nest',
    type: 'Miscellaneous',
    amount: '₦50,000',
  },
  {
    id: '10',
    name: 'Olowo Balogun',
    date: '24-1-2026',
    property: 'Zest Housing',
    type: 'Taxes',
    amount: '₦50,000',
  },
  {
    id: '11',
    name: 'Olowo Balogun',
    date: '24-1-2026',
    property: 'Zest Housing',
    type: 'Insurance',
    amount: '₦50,000',
  },
  {
    id: '12',
    name: 'Olowo Balogun',
    date: '24-1-2026',
    property: 'Ama Nest',
    type: 'Taxes',
    amount: '₦50,000',
  },
];

export function ExpensesTab({ searchTerm }: ExpensesTabProps) {
  // Filter expenses based on search term
  const filteredExpenses = expenses.filter(
    expense =>
      expense.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.property.toLowerCase().includes(searchTerm.toLowerCase()) ||
      expense.type.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Empty state
  if (filteredExpenses.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">
          {searchTerm
            ? `No expenses found matching "${searchTerm}". Try a different search term.`
            : 'No expenses found for this portfolio.'}
        </p>
        <button className="hover:bg-opacity-90 mt-4 rounded-md bg-[#e36b37] px-4 py-2 text-white transition-all">
          Add Expense to Portfolio
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="rounded-t-lg bg-[#f6f6f6]">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 first:rounded-tl-lg">
              Name
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Date
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Property
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">
              Type
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500 last:rounded-tr-lg">
              Amount
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {filteredExpenses.map(expense => (
            <tr key={expense.id} className="hover:bg-gray-50">
              <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                {expense.name}
              </td>
              <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                {expense.date}
              </td>
              <td className="px-4 py-4 text-sm whitespace-nowrap text-gray-500">
                {expense.property}
              </td>
              <td className="px-4 py-4 text-sm whitespace-nowrap">
                <TypeBadge type={expense.type} />
              </td>
              <td className="px-4 py-4 text-sm font-medium whitespace-nowrap text-gray-900">
                {expense.amount}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TypeBadge({ type }: { type: string }) {
  let color = '';

  switch (type) {
    case 'Maintenance':
      color = 'text-purple-600 bg-purple-50';
      break;
    case 'Utilities':
      color = 'text-blue-600 bg-blue-50';
      break;
    case 'Insurance':
      color = 'text-green-600 bg-green-50';
      break;
    case 'Taxes':
      color = 'text-red-600 bg-red-50';
      break;
    case 'Miscellaneous':
      color = 'text-orange-600 bg-orange-50';
      break;
    default:
      color = 'text-gray-600 bg-gray-50';
  }

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}
    >
      {type}
    </span>
  );
}
