import TransactionItem from '../TransactionItem';

export default function TransactionItemExample() {
  const mockTransaction = {
    id: '1',
    type: 'income' as const,
    amount: 2500000,
    category: 'Sales',
    description: 'Coffee Sales',
    date: new Date(2025, 9, 3, 10, 30),
  };

  return (
    <div className="p-6">
      <TransactionItem
        transaction={mockTransaction}
        onEdit={(t) => console.log('Edit:', t)}
        onDelete={(id) => console.log('Delete:', id)}
      />
    </div>
  );
}
