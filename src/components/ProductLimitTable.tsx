
import React, { useState } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Search } from 'lucide-react';
import { toast } from 'sonner';

interface ProductLimit {
  id: string;
  productCode: string;
  productName: string;
  limitGroup: string;
  roundGroup: string;
  updateDate: string;
  updateBy: string;
}

const ProductLimitTable = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLimitGroup, setSelectedLimitGroup] = useState('');
  const [selectedRoundGroup, setSelectedRoundGroup] = useState('');

  // Mock data
  const [products] = useState<ProductLimit[]>([
    {
      id: '1',
      productCode: '1234567',
      productName: 'นมยูเอชที รสจืด 1000ml',
      limitGroup: '1: 4 ชิ้น',
      roundGroup: '2: 24 ชิ้น',
      updateDate: '02/05/2025 11:17',
      updateBy: 'admin1'
    },
    {
      id: '2',
      productCode: '1234568',
      productName: 'นมยูเอชที รสช็อกโกแลต 1000ml',
      limitGroup: '2: 24 ชิ้น',
      roundGroup: '3: 48 ชิ้น',
      updateDate: '02/05/2025 10:30',
      updateBy: 'admin2'
    },
    {
      id: '3',
      productCode: '1234569',
      productName: 'นมยูเอชที รสสตรอเบอร์รี่ 1000ml',
      limitGroup: '3: 48 ชิ้น',
      roundGroup: 'ไม่กำหนดกลุ่ม',
      updateDate: '01/05/2025 16:45',
      updateBy: 'admin1'
    }
  ]);

  const limitGroups = ['1: 4 ชิ้น', '2: 24 ชิ้น', '3: 48 ชิ้น'];
  const roundGroups = ['2: 24 ชิ้น', '3: 48 ชิ้น', 'ไม่กำหนดกลุ่ม'];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.productName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLimitGroup = !selectedLimitGroup || product.limitGroup === selectedLimitGroup;
    const matchesRoundGroup = !selectedRoundGroup || product.roundGroup === selectedRoundGroup;
    
    return matchesSearch && matchesLimitGroup && matchesRoundGroup;
  });

  const handleViewDetails = (productCode: string) => {
    toast.info(`แสดงรายละเอียดสินค้า ${productCode}`);
  };

  const handleDelete = (productCode: string, productName: string) => {
    toast.error(`ยืนยันการลบสินค้า ${productCode} - ${productName}?`);
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
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
    </div>
  );
};

export default ProductLimitTable;
