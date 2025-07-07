
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ProductLimit } from '@/types/product';

interface ProductEditDialogProps {
  open: boolean;
  onClose: () => void;
  editingProduct: ProductLimit | null;
  onSave: (newProductCode: string) => void;
}

const ProductEditDialog = ({ open, onClose, editingProduct, onSave }: ProductEditDialogProps) => {
  const [newProductCode, setNewProductCode] = useState('');

  useEffect(() => {
    if (editingProduct) {
      setNewProductCode(editingProduct.productCode);
    }
  }, [editingProduct]);

  const handleSave = () => {
    onSave(newProductCode);
    setNewProductCode('');
  };

  const handleClose = () => {
    onClose();
    setNewProductCode('');
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>แก้ไขรหัสสินค้า</DialogTitle>
          <DialogDescription>
            กรุณาใส่รหัสสินค้าที่ถูกต้อง (7 หลัก)
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              รหัสสินค้าใหม่
            </label>
            <Input
              value={newProductCode}
              onChange={(e) => setNewProductCode(e.target.value)}
              placeholder="กรุณาใส่รหัสสินค้าที่ถูกต้อง"
              className="w-full"
            />
          </div>
          {editingProduct && (
            <div className="text-sm text-gray-600">
              <p>รหัสเดิม: <span className="font-mono">{editingProduct.productCode}</span></p>
              <p className="text-red-600 mt-1">หมายเหตุ: {editingProduct.errorMessage}</p>
            </div>
          )}
        </div>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={handleClose}>
            ยกเลิก
          </Button>
          <Button onClick={handleSave}>
            บันทึก
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProductEditDialog;
