
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { ProductLimit } from '@/types/product';
import ProductSearchFilters from './ProductSearchFilters';
import ProductTable from './ProductTable';
import ProductEditDialog from './ProductEditDialog';

const ProductLimitTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLimitGroup, setSelectedLimitGroup] = useState('');
  const [selectedRoundGroup, setSelectedRoundGroup] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductLimit | null>(null);

  // Mock data with some products having errors
  const [products, setProducts] = useState<ProductLimit[]>([
    {
      id: '1',
      productCode: '1234567',
      productName: 'นมยูเอชที รสจืด 1000ml',
      limitGroup: 'กลุ่ม 1 - จำกัด 4 ชิ้น',
      roundGroup: 'กลุ่ม 2 - จำกัด 24 ชิ้น',
      updateDate: '02/05/2025 11:17',
      updateBy: 'admin1'
    },
    {
      id: '2',
      productCode: 'INVALID001',
      productName: 'Product Name Not Found',
      limitGroup: 'กลุ่ม 2 - จำกัด 24 ชิ้น',
      roundGroup: 'กลุ่ม 3 - จำกัด 48 ชิ้น',
      updateDate: '02/05/2025 10:30',
      updateBy: 'admin2',
      hasError: true,
      errorMessage: 'Invalid Product Code'
    },
    {
      id: '3',
      productCode: '1234569',
      productName: 'นมยูเอชทีรสสตรอเบอร์รี่ 1000ml',
      limitGroup: 'กลุ่ม 3 - จำกัด 48 ชิ้น',
      roundGroup: 'ไม่กำหนดกลุ่ม',
      updateDate: '01/05/2025 16:45',
      updateBy: 'admin1'
    }
  ]);

  const limitGroups = ['กลุ่ม 1 - จำกัด 4 ชิ้น', 'กลุ่ม 2 - จำกัด 24 ชิ้น', 'กลุ่ม 3 - จำกัด 48 ชิ้น', 'ไม่กำหนดกลุ่ม'];
  const roundGroups = ['กลุ่ม 2 - จำกัด 24 ชิ้น', 'กลุ่ม 3 - จำกัด 48 ชิ้น', 'ไม่กำหนดกลุ่ม'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLimitGroup = !selectedLimitGroup || selectedLimitGroup === 'all' || product.limitGroup === selectedLimitGroup;
    const matchesRoundGroup = !selectedRoundGroup || selectedRoundGroup === 'all' || product.roundGroup === selectedRoundGroup;
    
    return matchesSearch && matchesLimitGroup && matchesRoundGroup;
  });

  const handleViewDetails = (productCode: string) => {
    toast.info(`แสดงรายละเอียดสินค้า ${productCode}`);
  };

  const handleDelete = (productCode: string, productName: string) => {
    toast.error(`ยืนยันการลบสินค้า ${productCode} - ${productName}?`);
  };

  const handleEditProduct = (product: ProductLimit) => {
    setEditingProduct(product);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = (newProductCode: string) => {
    if (!editingProduct || !newProductCode.trim()) {
      toast.error('กรุณาใส่รหัสสินค้า');
      return;
    }

    // Simulate product validation - consider valid if it's 7 digits and doesn't contain 'INVALID'
    const isValidProduct = newProductCode.length === 7 && !newProductCode.includes('INVALID') && /^\d+$/.test(newProductCode);
    
    setProducts(prev => prev.map(product => 
      product.id === editingProduct.id 
        ? {
            ...product,
            productCode: newProductCode,
            productName: isValidProduct ? `สินค้า ${newProductCode}` : 'Product Name Not Found',
            hasError: !isValidProduct,
            errorMessage: !isValidProduct ? 'Invalid Product Code' : undefined,
            updateDate: new Date().toLocaleString('th-TH'),
            updateBy: 'current_user'
          }
        : product
    ));

    setEditDialogOpen(false);
    setEditingProduct(null);
    
    toast.success(isValidProduct ? 'อัปเดตรหัสสินค้าสำเร็จ' : 'อัปเดตรหัสสินค้าแล้ว แต่ยังไม่ถูกต้อง');
  };

  return (
    <div className="space-y-4">
      <ProductSearchFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedLimitGroup={selectedLimitGroup}
        onLimitGroupChange={setSelectedLimitGroup}
        selectedRoundGroup={selectedRoundGroup}
        onRoundGroupChange={setSelectedRoundGroup}
        limitGroups={limitGroups}
        roundGroups={roundGroups}
      />

      <ProductTable
        products={filteredProducts}
        onViewDetails={handleViewDetails}
        onDelete={handleDelete}
        onEdit={handleEditProduct}
      />

      {filteredProducts.length > 0 && (
        <div className="text-center pt-4">
          <Button variant="outline">
            โหลดข้อมูลเพิ่มเติม
          </Button>
        </div>
      )}

      <ProductEditDialog
        open={editDialogOpen}
        onClose={() => setEditDialogOpen(false)}
        editingProduct={editingProduct}
        onSave={handleSaveEdit}
      />
    </div>
  );
};

export default ProductLimitTable;
