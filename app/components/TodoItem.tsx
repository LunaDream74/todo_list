'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Trash2, Check, Edit2, X, Save } from 'lucide-react';

interface TodoItemProps {
  todo: {
    id: number;
    text: string;
    deadline: string;
    status: string;
    finishedTime?: string;
    userId: number;
  };
  onToggle: (id: number) => void;
  onEdit: (id: number, text: string, deadline: string) => void;
  onDelete: (id: number) => void;
  isDisabled?: boolean;
}

export default function TodoItem({
  todo,
  onToggle,
  onEdit,
  onDelete,
  isDisabled = false,
}: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editDeadline, setEditDeadline] = useState(todo.deadline);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim(), editDeadline);
      setIsEditing(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return null;
    try {
      return new Date(timeString).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return null;
    }
  };

  const isOverdue =
    todo.status === 'pending' &&
    new Date(todo.deadline) < new Date();

  if (isEditing) {
    return (
      <div className="bg-gray-50 rounded-lg p-4 border-2 border-blue-200">
        <div className="space-y-3">
          <Input
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            className="w-full"
            placeholder="Task description"
          />
          <Input
            type="date"
            value={editDeadline}
            onChange={(e) => setEditDeadline(e.target.value)}
            className="w-full"
          />
          <div className="flex gap-2">
            <Button
              onClick={handleSave}
              className="flex-1 bg-green-600 hover:bg-green-700"
              size="sm"
              disabled={isDisabled}
            >
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button
              onClick={() => setIsEditing(false)}
              variant="outline"
              size="sm"
              className="flex-1"
              disabled={isDisabled}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`rounded-lg p-4 border-2 transition-all ${
        todo.status === 'done'
          ? 'bg-green-50 border-green-200'
          : isOverdue
          ? 'bg-red-50 border-red-200'
          : 'bg-white border-gray-200'
      }`}
    >
      <div className="flex items-start gap-4">
        {/* Checkbox */}
        <div className="flex items-center h-10">
          <Checkbox
            checked={todo.status === 'done'}
            onCheckedChange={() => onToggle(todo.id)}
            className="w-5 h-5"
            disabled={isDisabled}
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-lg font-medium break-word ${
              todo.status === 'done'
                ? 'text-gray-400 line-through'
                : 'text-gray-800'
            }`}
          >
            {todo.text}
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm">
            <span
              className={`${
                todo.status === 'done'
                  ? 'text-gray-400'
                  : isOverdue
                  ? 'text-red-600 font-semibold'
                  : 'text-gray-600'
              }`}
            >
              📅 {formatDate(todo.deadline)}
              {isOverdue && ' (Overdue)'}
            </span>
            {todo.status === 'done' && todo.finishedTime && (
              <span className="text-green-600">
                ✓ Done at {formatTime(todo.finishedTime)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="p-2 h-10 w-10"
            title="Edit task"
            disabled={isDisabled}
          >
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => onDelete(todo.id)}
            variant="outline"
            size="sm"
            className="p-2 h-10 w-10 text-red-600 hover:text-red-700 hover:bg-red-50"
            title="Delete task"
            disabled={isDisabled}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
