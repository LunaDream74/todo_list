'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type SortOption = 'deadline-asc' | 'deadline-desc' | 'status';

interface SortBarProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortBar({ value, onChange }: SortBarProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Sort By
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Sort options" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="deadline-asc">Deadline (Nearest First)</SelectItem>
          <SelectItem value="deadline-desc">Deadline (Furthest First)</SelectItem>
          <SelectItem value="status">Status (Pending First)</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
