
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ProductLimitTable from './ProductLimitTable';
import BulkAddModal from './BulkAddModal';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

const ProductLimitManager = () => {
  const [showBulkModal, setShowBulkModal] = useState(false);

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
          <ProductLimitTable />
        </CardContent>
      </Card>

      {/* Bulk Add Modal */}
      <BulkAddModal 
        open={showBulkModal}
        onClose={() => setShowBulkModal(false)}
      />
    </div>
  );
};

export default ProductLimitManager;
