
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Eye, Trash2, Search, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface ProductLimit {
  id: string;
  productCode: string;
  productName: string;
  limitGroup: string;
  roundGroup: string;
  updateDate: string;
  updateBy: string;
  hasError?: boolean;
  errorMessage?: string;
}

const ProductLimitTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLimitGroup, setSelectedLimitGroup] = useState('');
  const [selectedRoundGroup, setSelectedRoundGroup] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductLimit | null>(null);
  const [newProductCode, setNewProductCode] = useState('');

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
      productName: 'นมยูเอชที รสสตรอเบอร์รี่ 1000ml',
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
    setNewProductCode(product.productCode);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = () => {
    if (!editingProduct || !newProductCode.trim()) {
      toast.error('กรุณาใส่รหัสสินค้า');
      return;
    }

    // Simulate product validation
    const isValidProduct = newProductCode.length === 7 && !newProductCode.includes('INVALID');
    
    setProducts(prev => prev.map(product => 
      product.id === editingProduct.id 
        ? {
            ...product,
            productCode: newProductCode,
            productName: isValidProduct ? `สินค้า ${newProductCode}` : 'Product Name Not Found',
            hasError: !isValidProduct,
            errorMessage: isValidProduct ? undefined : 'Invalid Product Code',
            updateDate: new Date().toLocaleString('th-TH'),
            updateBy: 'current_user'
          }
        : product
    ));

    setEditDialogOpen(false);
    setEditingProduct(null);
    setNewProductCode('');
    
    toast.success(isValidProduct ? 'อัปเดตรหัสสินค้าสำเร็จ' : 'อัปเดตรหัสสินค้าแล้ว แต่ยังไม่ถูกต้อง');
  };

  return (
    <div className="space-y-4">
      {/* Search and Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="ค้นหารหัสสินค้า หรือชื่อสินค้า"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Select value={selectedLimitGroup} onValueChange={setSelectedLimitGroup}>
          <SelectTrigger>
            <SelectValue placeholder="กลุ่มจำนวนลิมิตสินค้า" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            {limitGroups.map(group => (
              <SelectItem key={group} value={group}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedRoundGroup} onValueChange={setSelectedRoundGroup}>
          <SelectTrigger>
            <SelectValue placeholder="กลุ่มจำนวนลิมิตสินค้าตามรอบ" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">ทั้งหมด</SelectItem>
            {roundGroups.map(group => (
              <SelectItem key={group} value={group}>{group}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>รหัสสินค้า</TableHead>
              <TableHead>ชื่อสินค้า</TableHead>
              <TableHead>กลุ่มลิมิตสินค้า</TableHead>
              <TableHead>กลุ่มลิมิตตามรอบ</TableHead>
              <TableHead>อัปเดตล่าสุด</TableHead>
              <TableHead>ผู้ทำรายการ</TableHead>
              <TableHead className="text-center">การจัดการ</TableHead>
              <TableHead>หมายเหตุ</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                  ไม่พบข้อมูลที่ตรงกับการค้นหา
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-mono">{product.productCode}</TableCell>
                  <TableCell className="max-w-xs truncate">{product.productName}</TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {product.limitGroup}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-green-100 text-green-800">
                      {product.roundGroup}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm text-gray-500">{product.updateDate}</TableCell>
                  <TableCell className="text-sm">{product.updateBy}</TableCell>
                  <TableCell>
                    <div className="flex justify-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewDetails(product.productCode)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {product.hasError && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditProduct(product)}
                          className="text-orange-600 hover:text-orange-700"
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(product.productCode, product.productName)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                  <TableCell>
                    {product.hasError && product.errorMessage && (
                      <span className="text-red-600 text-sm font-medium">
                        {product.errorMessage}
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Load More Button */}
      {filteredProducts.length > 0 && (
        <div className="text-center pt-4">
          <Button variant="outline">
            โหลดข้อมูลเพิ่มเติม
          </Button>
        </div>
      )}

      {/* Edit Product Code Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>แก้ไขรหัสสินค้า</DialogTitle>
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
            <Button
              variant="outline"
              onClick={() => setEditDialogOpen(false)}
            >
              ยกเลิก
            </Button>
            <Button onClick={handleSaveEdit}>
              บันทึก
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductLimitTable;
