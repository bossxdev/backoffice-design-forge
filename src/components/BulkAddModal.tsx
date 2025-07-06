
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Copy, Trash2, Upload } from 'lucide-react';
import { toast } from 'sonner';

interface BulkAddModalProps {
  open: boolean;
  onClose: () => void;
}

interface ProductRow {
  id: string;
  productCode: string;
  limitGroup: string;
  roundGroup: string;
}

const BulkAddModal = ({ open, onClose }: BulkAddModalProps) => {
  const [activeTab, setActiveTab] = useState('table');
  const [bulkText, setBulkText] = useState('');
  const [rows, setRows] = useState<ProductRow[]>([
    { id: '1', productCode: '', limitGroup: '', roundGroup: '' }
  ]);

  const limitGroups = ['1: 4 ชิ้น', '2: 24 ชิ้น', '3: 48 ชิ้น'];
  const roundGroups = ['2: 24 ชิ้น', '3: 48 ชิ้น', 'ไม่กำหนดกลุ่ม'];

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
    
    console.log('Saving products:', validRows);
    toast.success(`บันทึก ${validRows.length} รายการสำเร็จ`);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>เพิ่มสินค้าเข้ากลุ่มลิมิต</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="table">เพิ่มแบบตาราง</TabsTrigger>
            <TabsTrigger value="bulk">เพิ่มแบบข้อความ</TabsTrigger>
          </TabsList>

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
                  <code className="ml-2 text-sm">1234567, 1: 4 ชิ้น, 2: 24 ชิ้น</code>
                </div>
                <Textarea
                  placeholder="1234567, 1: 4 ชิ้น, 2: 24 ชิ้น&#10;1234568, 2: 24 ชิ้น, 3: 48 ชิ้น"
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
