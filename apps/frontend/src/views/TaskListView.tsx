import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskCard } from '../components/tasks/TaskCard';
import { TaskFilters } from '../components/tasks/TaskFilters';
import { TaskForm } from '../components/tasks/TaskForm';
import type {
  CreateTaskPayload,
  Task,
  UpdateTaskPayload,
} from '../services/tasks.service';
import { useAuthStore } from '../store/auth.store';
import { useTasksStore } from '../store/tasks.store';

export function TaskListView() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const {
    tasks,
    filter,
    loading,
    setFilter,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  } = useTasksStore();

  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleEdit = (task: Task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = (task: Task) => {
    setDeletingTask(task);
  };

  const confirmDelete = async () => {
    if (deletingTask) {
      await deleteTask(deletingTask.id);
      setDeletingTask(null);
    }
  };

  const handleFormSubmit = async (
    data: CreateTaskPayload | UpdateTaskPayload,
  ) => {
    if (editingTask) {
      await updateTask(editingTask.id, data as UpdateTaskPayload);
    } else {
      await createTask(data as CreateTaskPayload);
    }
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const initials = user?.username
    ? user.username.slice(0, 2).toUpperCase()
    : '??';

  return (
    <div className="min-h-screen bg-surface-900 flex flex-col gap-[18px] p-5 px-6">
      {/* Header Bar */}
      <header className="w-full h-[68px] bg-surface-800 rounded-card border border-surface-600 px-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2.5">
          <div className="w-[30px] h-[30px] bg-gradient-accent-120 rounded-lg flex items-center justify-center">
            <span className="text-text-primary font-bold text-sm">O</span>
          </div>
          <span className="text-text-secondary font-bold text-xl">
            Ops-Forge
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2.5">
          {/* New Task Button */}
          <button
            type="button"
            onClick={() => {
              setEditingTask(null);
              setShowForm(true);
            }}
            className="h-[38px] px-3.5 bg-gradient-accent rounded-input shadow-glow flex items-center gap-2 text-text-primary cursor-pointer hover:opacity-90 transition-opacity"
          >
            <span className="text-base font-bold">+</span>
            <span className="text-[13px] font-bold">New Task</span>
          </button>

          {/* User Chip */}
          <div className="h-[38px] bg-surface-700 rounded-input border border-surface-600 px-2.5 flex items-center gap-2">
            <div className="w-6 h-6 bg-surface-600 rounded-full flex items-center justify-center">
              <span className="text-text-secondary text-[10px] font-bold">
                {initials}
              </span>
            </div>
            <span className="text-text-label text-xs font-semibold">
              {user?.username}
            </span>
          </div>

          {/* Logout */}
          <button
            type="button"
            onClick={handleLogout}
            className="h-[38px] px-3 bg-surface-700 rounded-input border border-surface-600 text-text-label text-xs font-semibold hover:bg-surface-800 transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Filter Bar */}
      <TaskFilters active={filter} onChange={setFilter} />

      {/* Content Area */}
      <div className="flex-1 flex flex-col gap-4">
        {loading && tasks.length === 0 ? (
          /* Loading skeleton */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="bg-surface-700 rounded-card border border-surface-600 p-4 h-[120px] animate-pulse"
              >
                <div className="h-4 bg-surface-600 rounded w-3/4 mb-3" />
                <div className="flex gap-2 mb-3">
                  <div className="h-5 bg-surface-600 rounded-full w-12" />
                  <div className="h-5 bg-surface-600 rounded-full w-16" />
                </div>
                <div className="h-3 bg-surface-600 rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : tasks.length > 0 ? (
          /* Task Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="w-full h-[220px] bg-surface-800 rounded-card border border-surface-600 flex flex-col items-center justify-center gap-2.5">
            <div className="w-[52px] h-[52px] bg-surface-700 rounded-full border border-surface-600 flex items-center justify-center">
              <span className="text-text-muted text-2xl">⊘</span>
            </div>
            <h3 className="text-text-secondary text-base font-semibold">
              No tasks match this filter
            </h3>
            <p className="text-text-muted text-[13px]">
              Try switching status tabs or create a new task.
            </p>
          </div>
        )}
      </div>

      {/* FAB (mobile-friendly) */}
      <button
        type="button"
        onClick={() => {
          setEditingTask(null);
          setShowForm(true);
        }}
        className="fixed bottom-6 right-6 w-[54px] h-[54px] bg-gradient-accent rounded-full shadow-glow flex items-center justify-center text-text-primary text-2xl font-bold cursor-pointer hover:opacity-90 transition-opacity md:hidden"
      >
        +
      </button>

      {/* Delete Confirmation */}
      {deletingTask && (
        <>
          <div
            className="fixed inset-0 bg-[#020617A6] z-40 animate-fade-in"
            onClick={() => setDeletingTask(null)}
          />
          <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-surface-700 rounded-card border border-surface-600 p-6 z-50 w-full max-w-[400px] flex flex-col gap-4 animate-fade-in">
            <h3 className="text-text-primary text-lg font-bold">Delete Task</h3>
            <p className="text-text-muted text-sm">
              Are you sure you want to delete{' '}
              <span className="text-text-secondary font-semibold">
                "{deletingTask.title}"
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeletingTask(null)}
                className="h-[38px] px-4 bg-surface-900 rounded-input border border-surface-600 text-text-label text-[13px] font-semibold hover:bg-surface-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="h-[38px] px-4 bg-priority-high-bg rounded-input border border-priority-high-text/20 text-priority-high-text text-[13px] font-bold hover:opacity-90 transition-opacity cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      {/* Task Form Panel */}
      {showForm && (
        <TaskForm
          task={editingTask}
          onSubmit={handleFormSubmit}
          onClose={handleFormClose}
        />
      )}
    </div>
  );
}
