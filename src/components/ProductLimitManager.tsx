
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductLimitTable from './ProductLimitTable';
import BulkAddModal from './BulkAddModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { ProductLimit } from '@/types/product';

const ProductLimitManager = () => {
  const [showBulkModal, setShowBulkModal] = useState(false);
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

  const handleBulkSave = (newProducts: ProductLimit[]) => {
    setProducts(prev => [...prev, ...newProducts]);
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          จัดการลิมิตสินค้ารายออเดอร์
        </h1>
        <p className="text-gray-600">
          เพิ่มและจัดการลิมิตการสั่งซื้อสินค้าแต่ละรายการในแต่ละรอบ
        </p>
      </div>

      {/* Action Buttons */}
      <div className="mb-6 flex gap-3">
        <Button 
          onClick={() => setShowBulkModal(true)}
          className="bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่มสินค้าเข้ากลุ่มลิมิต
        </Button>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">รายการสินค้าในระบบลิมิต</CardTitle>
        </CardHeader>
        <CardContent>
          <ProductLimitTable products={products} setProducts={setProducts} />
        </CardContent>
      </Card>

      {/* Bulk Add Modal */}
      <BulkAddModal 
        open={showBulkModal}
        onClose={() => setShowBulkModal(false)}
        onSave={handleBulkSave}
      />
    </div>
  );
};

export default ProductLimitManager;
