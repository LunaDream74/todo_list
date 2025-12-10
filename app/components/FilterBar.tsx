'use client';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export type StatusFilter = 'all' | 'pending' | 'done';
export type DeadlineFilter = 'all' | 'overdue' | 'today' | 'future';

interface FilterBarProps {
  statusFilter: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  deadlineFilter: DeadlineFilter;
  onDeadlineChange: (value: DeadlineFilter) => void;
}

export default function FilterBar({
  statusFilter,
  onStatusChange,
  deadlineFilter,
  onDeadlineChange,
}: FilterBarProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Status
        </label>
        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="done">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Deadline
        </label>
        <Select value={deadlineFilter} onValueChange={onDeadlineChange}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Filter by deadline" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Deadlines</SelectItem>
            <SelectItem value="overdue">Overdue</SelectItem>
            <SelectItem value="today">Today</SelectItem>
            <SelectItem value="future">Future</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
