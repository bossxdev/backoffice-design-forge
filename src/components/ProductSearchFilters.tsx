
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface ProductSearchFiltersProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedLimitGroup: string;
  onLimitGroupChange: (value: string) => void;
  selectedRoundGroup: string;
  onRoundGroupChange: (value: string) => void;
  limitGroups: string[];
  roundGroups: string[];
}

const ProductSearchFilters = ({
  searchTerm,
  onSearchChange,
  selectedLimitGroup,
  onLimitGroupChange,
  selectedRoundGroup,
  onRoundGroupChange,
  limitGroups,
  roundGroups
}: ProductSearchFiltersProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          placeholder="ค้นหารหัสสินค้า หรือชื่อสินค้า"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10"
        />
      </div>
      
      <Select value={selectedLimitGroup} onValueChange={onLimitGroupChange}>
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

      <Select value={selectedRoundGroup} onValueChange={onRoundGroupChange}>
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
  );
};

export default ProductSearchFilters;
