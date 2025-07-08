import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Trash2, Upload, FileSpreadsheet } from 'lucide-react';
import { toast } from 'sonner';
import { ProductLimit } from '@/types/product';
import * as XLSX from 'xlsx';

interface BulkAddModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (products: ProductLimit[]) => void;
}

interface ProductRow {
  id: string;
  productCode: string;
  limitGroup: string;
  roundGroup: string;
}

const BulkAddModal = ({ open, onClose, onSave }: BulkAddModalProps) => {
  const [activeTab, setActiveTab] = useState('table');
  const [bulkText, setBulkText] = useState('');
  const [rows, setRows] = useState<ProductRow[]>([
    { id: '1', productCode: '', limitGroup: '', roundGroup: '' }
  ]);

  const limitGroups = ['กลุ่ม 1 - จำกัด 4 ชิ้น', 'กลุ่ม 2 - จำกัด 24 ชิ้น', 'กลุ่ม 3 - จำกัด 48 ชิ้น', 'ไม่กำหนดกลุ่ม'];
  const roundGroups = ['กลุ่ม 2 - จำกัด 24 ชิ้น', 'กลุ่ม 3 - จำกัด 48 ชิ้น', 'ไม่กำหนดกลุ่ม'];

  const addRow = () => {
    const newRow: ProductRow = {
      id: Date.now().toString(),
      productCode: '',
      limitGroup: '',
      roundGroup: ''
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof ProductRow, value: string) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const applyLimitGroupToAll = (group: string) => {
    setRows(rows.map(row => ({ ...row, limitGroup: group })));
    toast.success(`ใช้กลุ่มลิมิต "${group}" กับทุกรายการแล้ว`);
  };

  const applyRoundGroupToAll = (group: string) => {
    setRows(rows.map(row => ({ ...row, roundGroup: group })));
    toast.success(`ใช้กลุ่มรอบ "${group}" กับทุกรายการแล้ว`);
  };

  const handleExcelUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

        // Skip header row and process data
        const excelRows: ProductRow[] = [];
        for (let i = 1; i < jsonData.length; i++) {
          const row = jsonData[i] as any[];
          if (row.length >= 4 && row[0]) {
            // Map Excel data to our format
            const productCode = String(row[0]).replace('.0', ''); // Remove .0 from numbers
            const limitAmount = Number(row[2]) || 0;
            const roundAmount = Number(row[3]) || 0;
            
            // Map amounts to groups
            let limitGroup = 'ไม่กำหนดกลุ่ม';
            let roundGroup = 'ไม่กำหนดกลุ่ม';
            
            if (limitAmount <= 3) limitGroup = 'กลุ่ม 1 - จำกัด 4 ชิ้น';
            else if (limitAmount <= 24) limitGroup = 'กลุ่ม 2 - จำกัด 24 ชิ้น';
            else if (limitAmount <= 48) limitGroup = 'กลุ่ม 3 - จำกัด 48 ชิ้น';
            
            if (roundAmount <= 24) roundGroup = 'กลุ่ม 2 - จำกัด 24 ชิ้น';
            else if (roundAmount <= 48) roundGroup = 'กลุ่ม 3 - จำกัด 48 ชิ้น';

            excelRows.push({
              id: `excel-${i}`,
              productCode,
              limitGroup,
              roundGroup
            });
          }
        }

        if (excelRows.length > 0) {
          setRows(excelRows);
          setActiveTab('table');
          toast.success(`นำเข้าข้อมูลจาก Excel สำเร็จ ${excelRows.length} รายการ`);
        } else {
          toast.error('ไม่พบข้อมูลที่ถูกต้องในไฟล์ Excel');
        }
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        toast.error('เกิดข้อผิดพลาดในการอ่านไฟล์ Excel');
      }
    };
    reader.readAsArrayBuffer(file);
    
    // Reset file input
    event.target.value = '';
  };

  const parseBulkText = () => {
    const lines = bulkText.trim().split('\n');
    const newRows: ProductRow[] = [];
    
    lines.forEach((line, index) => {
      const parts = line.split(',').map(part => part.trim());
      if (parts.length >= 3) {
        newRows.push({
          id: `bulk-${index}`,
          productCode: parts[0],
          limitGroup: parts[1],
          roundGroup: parts[2]
        });
      }
    });
    
    if (newRows.length > 0) {
      setRows(newRows);
      setActiveTab('table');
      toast.success(`นำเข้า ${newRows.length} รายการสำเร็จ`);
    } else {
      toast.error('รูปแบบข้อมูลไม่ถูกต้อง');
    }
  };

  const handleSave = () => {
    const validRows = rows.filter(row => 
      row.productCode && row.limitGroup && row.roundGroup
    );
    
    if (validRows.length === 0) {
      toast.error('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }
    
    // Convert rows to ProductLimit format
    const newProducts: ProductLimit[] = validRows.map((row, index) => {
      const isValidProduct = row.productCode.length === 7 && /^\d+$/.test(row.productCode);
      
      return {
        id: `new-${Date.now()}-${index}`,
        productCode: row.productCode,
        productName: isValidProduct ? `สินค้า ${row.productCode}` : 'Product Name Not Found',
        limitGroup: row.limitGroup,
        roundGroup: row.roundGroup,
        updateDate: new Date().toLocaleString('th-TH'),
        updateBy: 'current_user',
        hasError: !isValidProduct,
        errorMessage: !isValidProduct ? 'Invalid Product Code' : undefined
      };
    });
    
    onSave(newProducts);
    toast.success(`บันทึก ${validRows.length} รายการสำเร็จ`);
    
    // Reset form
    setRows([{ id: '1', productCode: '', limitGroup: '', roundGroup: '' }]);
    setBulkText('');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>เพิ่มสินค้าเข้ากลุ่มลิมิต</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="table">เพิ่มแบบตาราง</TabsTrigger>
            <TabsTrigger value="bulk">เพิ่มแบบข้อความ</TabsTrigger>
            <TabsTrigger value="excel">นำเข้า Excel</TabsTrigger>
          </TabsList>

          <TabsContent value="excel" className="space-y-4">
            <div className="space-y-4 p-4">
              <div className="text-center">
                <FileSpreadsheet className="mx-auto h-12 w-12 text-green-600 mb-4" />
                <h3 className="text-lg font-medium mb-2">นำเข้าข้อมูลจากไฟล์ Excel</h3>
                <p className="text-gray-600 mb-4">
                  เลือกไฟล์ Excel ที่มีข้อมูลสินค้าในรูปแบบที่กำหนด
                </p>
              </div>
              
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelUpload}
                    className="hidden"
                    id="excel-upload"
                  />
                  <label
                    htmlFor="excel-upload"
                    className="cursor-pointer inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors"
                  >
                    <Upload className="w-4 h-4" />
                    เลือกไฟล์ Excel
                  </label>
                  <p className="mt-2 text-sm text-gray-500">
                    รองรับไฟล์ .xlsx และ .xls
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-medium text-blue-900 mb-2">รูปแบบข้อมูลที่ต้องการ:</h4>
                <div className="text-sm text-blue-800 space-y-1">
                  <p><strong>คอลัมน์ที่ 1:</strong> รหัสสินค้า</p>
                  <p><strong>คอลัมน์ที่ 2:</strong> ชื่อสินค้า</p>
                  <p><strong>คอลัมน์ที่ 3:</strong> จำนวนที่ limit ถึงที่, รับร้าน</p>
                  <p><strong>คอลัมน์ที่ 4:</strong> จำนวนที่ limit จัดส่งตามรอบ</p>
                  <p><strong>คอลัมน์ที่ 5:</strong> วันที่สร้าง</p>
                </div>
                <div className="mt-3 text-xs text-blue-700">
                  <p>* ระบบจะแปลงจำนวน limit เป็นกลุ่มโดยอัตโนมัติ</p>
                  <p>* ≤3: กลุ่ม 1, ≤24: กลุ่ม 2, ≤48: กลุ่ม 3</p>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="table" className="space-y-4 overflow-auto max-h-[70vh]">
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">กลุ่มลิมิต:</span>
                {limitGroups.map(group => (
                  <Button
                    key={group}
                    variant="outline"
                    size="sm"
                    onClick={() => applyLimitGroupToAll(group)}
                    className="text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {group}
                  </Button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">กลุ่มรอบ:</span>
                {roundGroups.map(group => (
                  <Button
                    key={group}
                    variant="outline"
                    size="sm"
                    onClick={() => applyRoundGroupToAll(group)}
                    className="text-xs"
                  >
                    <Copy className="w-3 h-3 mr-1" />
                    {group}
                  </Button>
                ))}
              </div>
            </div>

            {/* Product Rows */}
            <div className="space-y-3">
              {rows.map((row, index) => (
                <div key={row.id} className="grid grid-cols-12 gap-3 items-center p-3 bg-white border rounded-lg">
                  <div className="col-span-1 text-sm text-gray-500 text-center">
                    {index + 1}
                  </div>
                  
                  <div className="col-span-3">
                    <Input
                      placeholder="รหัสสินค้า"
                      value={row.productCode}
                      onChange={(e) => updateRow(row.id, 'productCode', e.target.value)}
                    />
                  </div>
                  
                  <div className="col-span-3">
                    <Select
                      value={row.limitGroup}
                      onValueChange={(value) => updateRow(row.id, 'limitGroup', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="กลุ่มลิมิตสินค้า" />
                      </SelectTrigger>
                      <SelectContent>
                        {limitGroups.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-3">
                    <Select
                      value={row.roundGroup}
                      onValueChange={(value) => updateRow(row.id, 'roundGroup', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="กลุ่มลิมิตตามรอบ" />
                      </SelectTrigger>
                      <SelectContent>
                        {roundGroups.map(group => (
                          <SelectItem key={group} value={group}>{group}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="col-span-2 flex gap-1">
                    {index === rows.length - 1 && (
                      <Button variant="outline" size="sm" onClick={addRow}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    )}
                    {rows.length > 1 && (
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => removeRow(row.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="bulk" className="space-y-4">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  วางข้อมูลในรูปแบบ: รหัสสินค้า, กลุ่มลิมิต, กลุ่มรอบ
                </label>
                <div className="mb-2">
                  <Badge variant="secondary">ตัวอย่าง:</Badge>
                  <code className="ml-2 text-sm">1234567, กลุ่ม 1 - จำกัด 4 ชิ้น, กลุ่ม 2 - จำกัด 24 ชิ้น</code>
                </div>
                <Textarea
                  placeholder="1234567, กลุ่ม 1 - จำกัด 4 ชิ้น, กลุ่ม 2 - จำกัด 24 ชิ้น&#10;1234568, กลุ่ม 2 - จำกัด 24 ชิ้น, กลุ่ม 3 - จำกัด 48 ชิ้น"
                  value={bulkText}
                  onChange={(e) => setBulkText(e.target.value)}
                  rows={8}
                />
              </div>
              
              <Button onClick={parseBulkText} className="w-full">
                <Upload className="w-4 h-4 mr-2" />
                นำเข้าข้อมูล
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            ยกเลิก
          </Button>
          <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
            บันทึกทั้งหมด
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAddModal;
