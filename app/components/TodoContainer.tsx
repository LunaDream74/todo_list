'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { Todo } from '@/app/types';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import SearchBar from './SearchBar';
import FilterBar, { StatusFilter, DeadlineFilter } from './FilterBar';
import SortBar, { SortOption } from './SortBar';
import { Trash2, Plus, Settings2 } from 'lucide-react';

export default function TodoContainer() {
  // Generate today's date and other date references
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const nextWeek = new Date(today);
  nextWeek.setDate(nextWeek.getDate() + 7);
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const formatDateString = (date: Date) => date.toISOString().split('T')[0];

  const [todos, setTodos] = useState<Todo[]>([
    {
      id: '1',
      text: 'Complete project proposal',
      deadline: formatDateString(nextWeek),
      status: 'pending',
    },
    {
      id: '2',
      text: 'Review team feedback',
      deadline: formatDateString(yesterday),
      status: 'done',
      finishedTime: new Date(2025, 11, 11, 14, 30).toISOString(),
    },
    {
      id: '3',
      text: 'Setup development environment',
      deadline: formatDateString(nextWeek),
      status: 'pending',
    },
    {
      id: '4',
      text: 'Update documentation',
      deadline: formatDateString(yesterday),
      status: 'pending',
    },
    {
      id: '5',
      text: 'Meeting with client',
      deadline: formatDateString(tomorrow),
      status: 'pending',
    },
    {
      id: '6',
      text: 'Fix reported bugs',
      deadline: formatDateString(today),
      status: 'done',
      finishedTime: new Date().toISOString(),
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('deadline-asc');
  const [showFilters, setShowFilters] = useState(false);

  const addTodo = (text: string, deadline: string) => {
    const newTodo: Todo = {
      id: Date.now().toString(),
      text,
      deadline,
      status: 'pending',
    };
    setTodos([...todos, newTodo]);
    setShowForm(false);
  };

  const updateTodo = (id: string, text: string, deadline: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, text, deadline } : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const toggleStatus = (id: string) => {
    setTodos(
      todos.map((todo) => {
        if (todo.id === id) {
          const newStatus = todo.status === 'pending' ? 'done' : 'pending';
          return {
            ...todo,
            status: newStatus,
            finishedTime: newStatus === 'done' ? new Date().toISOString() : undefined,
          };
        }
        return todo;
      })
    );
  };

  const pendingTodos = todos.filter((todo) => todo.status === 'pending');
  const doneTodos = todos.filter((todo) => todo.status === 'done');

  // Filtering and sorting logic
  const getDeadlineCategory = (deadline: string): 'overdue' | 'today' | 'future' => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);
    
    if (deadlineDate < today) return 'overdue';
    if (deadlineDate.getTime() === today.getTime()) return 'today';
    return 'future';
  };

  const filteredAndSortedTodos = useMemo(() => {
    let result = [...todos];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter((todo) =>
        todo.text.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter((todo) => todo.status === statusFilter);
    }

    // Apply deadline filter
    if (deadlineFilter !== 'all') {
      result = result.filter((todo) => {
        const category = getDeadlineCategory(todo.deadline);
        return category === deadlineFilter;
      });
    }

    // Apply sorting
    result.sort((a, b) => {
      if (sortOption === 'deadline-asc') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortOption === 'deadline-desc') {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      } else if (sortOption === 'status') {
        // Pending first, then done
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return 0;
      }
      return 0;
    });

    return result;
  }, [todos, searchQuery, statusFilter, deadlineFilter, sortOption]);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              My Tasks
            </h1>
            <p className="text-gray-600">
              {todos.length} total · {pendingTodos.length} pending · {doneTodos.length} completed
            </p>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          {/* Filter and Sort Toggle */}
          <div className="mb-6">
            <Button
              onClick={() => setShowFilters(!showFilters)}
              variant="outline"
              className="w-full flex items-center justify-center gap-2"
            >
              <Settings2 className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters & Sort'}
            </Button>
          </div>

          {/* Filter and Sort Controls */}
          {showFilters && (
            <div className="bg-gray-50 rounded-lg p-5 mb-6 border-2 border-gray-200 space-y-4">
              <FilterBar
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                deadlineFilter={deadlineFilter}
                onDeadlineChange={setDeadlineFilter}
              />
              <SortBar value={sortOption} onChange={setSortOption} />
            </div>
          )}

          {/* Add Todo Button */}
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="w-full mb-6 bg-blue-600 hover:bg-blue-700"
              size="lg"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          )}

          {/* Todo Form */}
          {showForm && (
            <TodoForm
              onAdd={addTodo}
              onCancel={() => setShowForm(false)}
            />
          )}

          {/* Pending Todos Section */}
          {filteredAndSortedTodos.length > 0 && (
            <div className="space-y-6">
              {(() => {
                // Group todos by status or show all depending on filter
                if (statusFilter !== 'all') {
                  // Show all filtered results without grouping
                  return (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                        <span className={`inline-block w-3 h-3 rounded-full mr-2 ${
                          statusFilter === 'pending' ? 'bg-yellow-400' : 'bg-green-500'
                        }`}></span>
                        {statusFilter === 'pending' ? 'Pending' : 'Completed'} Tasks ({filteredAndSortedTodos.length})
                      </h2>
                      <div className="space-y-3">
                        {filteredAndSortedTodos.map((todo) => (
                          <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleStatus}
                            onEdit={updateTodo}
                            onDelete={deleteTodo}
                          />
                        ))}
                      </div>
                    </div>
                  );
                } else if (deadlineFilter !== 'all') {
                  // Show all filtered results without grouping by status
                  const categoryLabels: Record<DeadlineFilter, string> = {
                    all: 'All Tasks',
                    overdue: 'Overdue Tasks',
                    today: "Today's Tasks",
                    future: 'Future Tasks',
                  };
                  
                  return (
                    <div>
                      <h2 className="text-xl font-semibold text-gray-700 mb-4">
                        {categoryLabels[deadlineFilter]} ({filteredAndSortedTodos.length})
                      </h2>
                      <div className="space-y-3">
                        {filteredAndSortedTodos.map((todo) => (
                          <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={toggleStatus}
                            onEdit={updateTodo}
                            onDelete={deleteTodo}
                          />
                        ))}
                      </div>
                    </div>
                  );
                } else {
                  // Group by status when no specific filter is applied
                  const pendingFiltered = filteredAndSortedTodos.filter(t => t.status === 'pending');
                  const doneFiltered = filteredAndSortedTodos.filter(t => t.status === 'done');

                  return (
                    <>
                      {pendingFiltered.length > 0 && (
                        <div className="mb-8">
                          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                            Pending Tasks ({pendingFiltered.length})
                          </h2>
                          <div className="space-y-3">
                            {pendingFiltered.map((todo) => (
                              <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleStatus}
                                onEdit={updateTodo}
                                onDelete={deleteTodo}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {doneFiltered.length > 0 && (
                        <div>
                          <h2 className="text-xl font-semibold text-gray-700 mb-4 flex items-center">
                            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                            Completed Tasks ({doneFiltered.length})
                          </h2>
                          <div className="space-y-3">
                            {doneFiltered.map((todo) => (
                              <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={toggleStatus}
                                onEdit={updateTodo}
                                onDelete={deleteTodo}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                }
              })()}
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedTodos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">
                {searchQuery || statusFilter !== 'all' || deadlineFilter !== 'all'
                  ? 'No tasks match your filters. Try adjusting your search or filters.'
                  : 'No tasks yet. Create one to get started!'}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
