'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X } from 'lucide-react';

interface TodoFormProps {
  onAdd: (text: string, deadline: string) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

export default function TodoForm({ onAdd, onCancel, isLoading = false }: TodoFormProps) {
  const [text, setText] = useState('');
  const [deadline, setDeadline] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim() && deadline) {
      onAdd(text.trim(), deadline);
      setText('');
      setDeadline('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-blue-50 rounded-lg p-5 mb-6 border-2 border-blue-200"
    >
      <div className="space-y-4">
        <div>
          <label htmlFor="task-text" className="block text-sm font-medium text-gray-700 mb-2">
            Task Description
          </label>
          <Input
            id="task-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What do you need to do?"
            className="w-full"
            required
          />
        </div>

        <div>
          <label htmlFor="task-deadline" className="block text-sm font-medium text-gray-700 mb-2">
            Deadline
          </label>
          <Input
            id="task-deadline"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full"
            required
          />
        </div>

        <div className="flex gap-3">
          <Button
            type="submit"
            className="flex-1 bg-green-600 hover:bg-green-700"
            disabled={isLoading}
          >
            Add Task
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1"
            disabled={isLoading}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel
          </Button>
        </div>
      </div>
    </form>
  );
}
