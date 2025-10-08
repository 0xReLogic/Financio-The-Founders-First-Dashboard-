import { useState } from 'react';
import { FileText, Pencil, Trash2, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Transaction } from '@shared/types';
import { formatCurrency, formatDate } from '@/lib/mockData';
import EditTransactionDialog from './EditTransactionDialog';
import DeleteConfirmDialog from './DeleteConfirmDialog';
import { storageService } from '@/lib/databaseService';

interface TransactionItemProps {
  transaction: Transaction;
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
  onViewReceipt?: (transaction: Transaction) => void;
}
export default function TransactionItem({
  transaction,
  onEdit,
  onDelete,
  onViewReceipt,
}: TransactionItemProps) {
  const isIncome = transaction.type === 'income';
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleEdit = (updatedTransaction: Transaction) => {
    onEdit?.(updatedTransaction);
  };

  const handleDelete = () => {
    onDelete?.(transaction.id);
    setDeleteOpen(false);
  };

  const handleViewReceipt = () => {
    if (transaction.receiptUrl) {
      try {
        const url = storageService.getFileUrl(transaction.receiptUrl);
        console.log('📸 Receipt URL:', url);
        console.log('📸 File ID:', transaction.receiptUrl);
        window.open(url, '_blank');
      } catch (error) {
        console.error('Error opening receipt:', error);
      }
    }
  };

  return (
    <>
      <EditTransactionDialog
        transaction={transaction}
        open={editOpen}
        onOpenChange={setEditOpen}
        onSave={handleEdit}
      />
      <DeleteConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={handleDelete}
        title="Hapus Transaksi?"
        description={`Apakah Anda yakin ingin menghapus transaksi "${transaction.description}"? Tindakan ini tidak dapat dibatalkan.`}
      />
    
    <div
      className="flex items-center justify-between p-4 bg-card border border-card-border rounded-md hover-elevate"
      data-testid={`transaction-item-${transaction.id}`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div
          className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${
            isIncome ? 'bg-[#65a30d]/10' : 'bg-destructive/10'
          }`}
        >
          {isIncome ? (
            <ArrowUpRight className="w-5 h-5 text-[#65a30d]" />
          ) : (
            <ArrowDownLeft className="w-5 h-5 text-destructive" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-sm truncate" data-testid={`text-transaction-title-${transaction.id}`}>
              {transaction.description}
            </h4>
            <Badge variant="secondary" className="text-xs flex-shrink-0">
              {transaction.category}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">{formatDate(transaction.date)}</p>
        </div>
        <div className="flex items-center gap-3">
          <p
            className={`text-lg font-bold flex-shrink-0 ${
              isIncome ? 'text-[#65a30d]' : 'text-destructive'
            }`}
            data-testid={`text-transaction-amount-${transaction.id}`}
          >
            {isIncome ? '+' : '-'}
            {formatCurrency(transaction.amount)}
          </p>
          <div className="flex items-center gap-1 flex-shrink-0">
            {transaction.receiptUrl && (
              <Button
                size="icon"
                variant="ghost"
                onClick={handleViewReceipt}
                title="Lihat Bukti Transaksi"
                data-testid={`button-view-receipt-${transaction.id}`}
              >
                <FileText className="w-4 h-4" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setEditOpen(true)}
              data-testid={`button-edit-${transaction.id}`}
            >
              <Pencil className="w-4 h-4" />
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setDeleteOpen(true)}
              data-testid={`button-delete-${transaction.id}`}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
