'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import TodoForm from './TodoForm';
import TodoItem from './TodoItem';
import SearchBar from './SearchBar';
import FilterBar, { StatusFilter, DeadlineFilter } from './FilterBar';
import SortBar, { SortOption } from './SortBar';
import { Settings2, Plus, Loader, LogOut } from 'lucide-react';
import { useSession } from 'next-auth/react';
import {
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
  toggleTodoStatus,
} from '@/app/actions/todoActions';
import { handleSignOut } from '@/app/actions/authActions';

interface Todo {
  id: number;
  text: string;
  deadline: string;
  status: string;
  finishedTime?: string;
  userId: number;
}

export default function TodoContainer() {
  const { data: session } = useSession();
  const [todos, setTodos] = useState<Todo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [deadlineFilter, setDeadlineFilter] = useState<DeadlineFilter>('all');
  const [sortOption, setSortOption] = useState<SortOption>('deadline-asc');
  const [showFilters, setShowFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Load todos on component mount (since this component only renders for authenticated users)
  useEffect(() => {
    const loadTodos = async () => {
      try {
        setIsLoading(true);
        const data = await getTodos();
        setTodos(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load todos');
      } finally {
        setIsLoading(false);
      }
    };

    // Load todos immediately since this component only renders for authenticated users
    loadTodos();
  }, []);

  const handleAddTodo = async (text: string, deadline: string) => {
    try {
      setIsSaving(true);
      setError('');
      const newTodo = await createTodo(text, deadline);
      setTodos([...todos, newTodo]);
      setShowForm(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create todo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleUpdateTodo = async (
    id: number,
    text: string,
    deadline: string
  ) => {
    try {
      setIsSaving(true);
      setError('');
      const updated = await updateTodo(id, text, deadline);
      setTodos(todos.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setIsSaving(true);
      setError('');
      await deleteTodo(id);
      setTodos(todos.filter(t => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete todo');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleStatus = async (id: number) => {
    try {
      setIsSaving(true);
      setError('');
      const updated = await toggleTodoStatus(id);
      setTodos(todos.map(t => (t.id === id ? updated : t)));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update todo');
    } finally {
      setIsSaving(false);
    }
  };

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

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(todo =>
        todo.text.toLowerCase().includes(query)
      );
    }

    if (statusFilter !== 'all') {
      result = result.filter(todo => todo.status === statusFilter);
    }

    if (deadlineFilter !== 'all') {
      result = result.filter(todo => {
        const category = getDeadlineCategory(todo.deadline);
        return category === deadlineFilter;
      });
    }

    result.sort((a, b) => {
      if (sortOption === 'deadline-asc') {
        return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      } else if (sortOption === 'deadline-desc') {
        return new Date(b.deadline).getTime() - new Date(a.deadline).getTime();
      } else if (sortOption === 'status') {
        if (a.status === 'pending' && b.status !== 'pending') return -1;
        if (a.status !== 'pending' && b.status === 'pending') return 1;
        return 0;
      }
      return 0;
    });

    return result;
  }, [todos, searchQuery, statusFilter, deadlineFilter, sortOption]);

  const pendingTodos = todos.filter(todo => todo.status === 'pending');
  const doneTodos = todos.filter(todo => todo.status === 'done');

  const handleSignOutClick = async () => {
    await handleSignOut();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-slate-300">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-purple-900 to-slate-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl shadow-2xl border border-slate-700/50 p-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                My Tasks
              </h1>
              <p className="text-slate-300">
                Welcome, {session?.user?.name || 'User'}! • {todos.length} total · {pendingTodos.length} pending · {doneTodos.length} completed
              </p>
            </div>
            <Button
              onClick={handleSignOutClick}
              variant="outline"
              className="text-red-400 hover:text-red-300 hover:bg-red-900/20 border-red-400/50"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-300 text-sm">
              {error}
            </div>
          )}

          {isSaving && (
            <div className="mb-6 p-4 bg-purple-900/20 border border-purple-500/50 rounded-lg text-purple-300 text-sm flex items-center">
              <Loader className="w-4 h-4 animate-spin mr-2" />
              Saving changes...
            </div>
          )}

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
              disabled={isSaving}
            >
              <Settings2 className="w-4 h-4" />
              {showFilters ? 'Hide Filters' : 'Show Filters & Sort'}
            </Button>
          </div>

          {/* Filter and Sort Controls */}
          {showFilters && (
            <div className="bg-slate-700/50 rounded-lg p-5 mb-6 border border-slate-600 space-y-4">
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
              disabled={isSaving}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add New Task
            </Button>
          )}

          {/* Todo Form */}
          {showForm && (
            <TodoForm
              onAdd={handleAddTodo}
              onCancel={() => setShowForm(false)}
              isLoading={isSaving}
            />
          )}

          {/* Todos List */}
          {filteredAndSortedTodos.length > 0 && (
            <div className="space-y-6">
              {statusFilter !== 'all' ? (
                <div>
                  <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
                    <span
                      className={`inline-block w-3 h-3 rounded-full mr-2 ${
                        statusFilter === 'pending'
                          ? 'bg-yellow-400'
                          : 'bg-green-500'
                      }`}
                    ></span>
                    {statusFilter === 'pending' ? 'Pending' : 'Completed'}{' '}
                    Tasks ({filteredAndSortedTodos.length})
                  </h2>
                  <div className="space-y-3">
                    {filteredAndSortedTodos.map(todo => (
                      <TodoItem
                        key={todo.id}
                        todo={todo}
                        onToggle={handleToggleStatus}
                        onEdit={handleUpdateTodo}
                        onDelete={handleDeleteTodo}
                        isDisabled={isSaving}
                      />
                    ))}
                  </div>
                </div>
              ) : deadlineFilter !== 'all' ? (
                (() => {
                  const categoryLabels: Record<DeadlineFilter, string> = {
                    all: 'All Tasks',
                    overdue: 'Overdue Tasks',
                    today: "Today's Tasks",
                    future: 'Future Tasks',
                  };

                  return (
                    <div>
                      <h2 className="text-xl font-semibold text-slate-200 mb-4">
                        {categoryLabels[deadlineFilter]} (
                        {filteredAndSortedTodos.length})
                      </h2>
                      <div className="space-y-3">
                        {filteredAndSortedTodos.map(todo => (
                          <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={handleToggleStatus}
                            onEdit={handleUpdateTodo}
                            onDelete={handleDeleteTodo}
                            isDisabled={isSaving}
                          />
                        ))}
                      </div>
                    </div>
                  );
                })()
              ) : (
                (() => {
                  const pendingFiltered = filteredAndSortedTodos.filter(
                    t => t.status === 'pending'
                  );
                  const doneFiltered = filteredAndSortedTodos.filter(
                    t => t.status === 'done'
                  );

                  return (
                    <>
                      {pendingFiltered.length > 0 && (
                        <div className="mb-8">
                          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
                            <span className="inline-block w-3 h-3 bg-yellow-400 rounded-full mr-2"></span>
                            Pending Tasks ({pendingFiltered.length})
                          </h2>
                          <div className="space-y-3">
                            {pendingFiltered.map(todo => (
                              <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={handleToggleStatus}
                                onEdit={handleUpdateTodo}
                                onDelete={handleDeleteTodo}
                                isDisabled={isSaving}
                              />
                            ))}
                          </div>
                        </div>
                      )}

                      {doneFiltered.length > 0 && (
                        <div>
                          <h2 className="text-xl font-semibold text-slate-200 mb-4 flex items-center">
                            <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                            Completed Tasks ({doneFiltered.length})
                          </h2>
                          <div className="space-y-3">
                            {doneFiltered.map(todo => (
                              <TodoItem
                                key={todo.id}
                                todo={todo}
                                onToggle={handleToggleStatus}
                                onEdit={handleUpdateTodo}
                                onDelete={handleDeleteTodo}
                                isDisabled={isSaving}
                              />
                            ))}
                          </div>
                        </div>
                      )}
                    </>
                  );
                })()
              )}
            </div>
          )}

          {/* Empty State */}
          {filteredAndSortedTodos.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400 text-lg">
                {searchQuery ||
                statusFilter !== 'all' ||
                deadlineFilter !== 'all'
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
