
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, Trash2, Edit } from 'lucide-react';
import { ProductLimit } from '@/types/product';

interface ProductTableProps {
  products: ProductLimit[];
  onViewDetails: (productCode: string) => void;
  onDelete: (productCode: string, productName: string) => void;
  onEdit: (product: ProductLimit) => void;
}

const ProductTable = ({ products, onViewDetails, onDelete, onEdit }: ProductTableProps) => {
  return (
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
          {products.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                ไม่พบข้อมูลที่ตรงกับการค้นหา
              </TableCell>
            </TableRow>
          ) : (
            products.map((product) => (
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
                      onClick={() => onViewDetails(product.productCode)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    {product.hasError && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(product)}
                        className="text-orange-600 hover:text-orange-700"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDelete(product.productCode, product.productName)}
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
  );
};

export default ProductTable;
