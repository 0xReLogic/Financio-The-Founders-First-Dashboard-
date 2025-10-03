import { useState } from 'react';
import { Plus, Pencil, Trash2, FolderOpen } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import CategoryDialog from '@/components/CategoryDialog';
import EmptyState from '@/components/EmptyState';
import { useToast } from '@/hooks/use-toast';
import { mockCategories, mockTransactions, formatCurrency } from '@/lib/mockData';

export default function Categories() {
  const { toast } = useToast();
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<any>(null);

  // Calculate statistics for each category
  const getCategoryStats = (categoryName: string) => {
    const categoryTransactions = mockTransactions.filter(
      (t) => t.category === categoryName
    );
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return {
      count: categoryTransactions.length,
      total,
    };
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setCategoryDialogOpen(true);
  };

  const handleEditCategory = (category: any) => {
    setSelectedCategory(category);
    setCategoryDialogOpen(true);
  };

  const handleDeleteClick = (category: any) => {
    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (categoryToDelete) {
      toast({
        title: 'Kategori dihapus',
        description: `${categoryToDelete.name} berhasil dihapus`,
      });
      setDeleteDialogOpen(false);
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">
            Kategori
          </h1>
          <p className="text-muted-foreground mt-1">
            Kelola kategori transaksi Anda
          </p>
        </div>
        <Button onClick={handleAddCategory} data-testid="button-add-category">
          <Plus className="w-4 h-4 mr-2" />
          Tambah Kategori
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {mockCategories.length === 0 ? (
          <div className="col-span-full">
            <EmptyState
              icon={FolderOpen}
              title="Belum Ada Kategori"
              description="Buat kategori untuk mengorganisir transaksi Anda dengan lebih baik."
              actionLabel="Tambah Kategori"
              onAction={handleAddCategory}
            />
          </div>
        ) : (
          mockCategories.map((category) => {
            const stats = getCategoryStats(category.name);
            return (
              <Card
                key={category.id}
                className="hover-elevate"
                data-testid={`card-category-${category.id}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className="w-12 h-12 rounded-md flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <div
                        className="w-6 h-6 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleEditCategory(category)}
                        data-testid={`button-edit-category-${category.id}`}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => handleDeleteClick(category)}
                        data-testid={`button-delete-category-${category.id}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={category.type === 'income' ? 'default' : 'secondary'}>
                      {category.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                    </Badge>
                  </div>
                  <div className="pt-3 border-t space-y-1">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Transaksi</span>
                      <span className="font-medium">{stats.count}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Total</span>
                      <span className="font-semibold" style={{ color: category.color }}>
                        {formatCurrency(stats.total)}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

      <CategoryDialog
        open={categoryDialogOpen}
        onOpenChange={setCategoryDialogOpen}
        category={selectedCategory}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kategori?</AlertDialogTitle>
            <AlertDialogDescription>
              Apakah Anda yakin ingin menghapus kategori "{categoryToDelete?.name}"?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
