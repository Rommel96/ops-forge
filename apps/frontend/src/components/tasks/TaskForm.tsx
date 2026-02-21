import { type FormEvent, useEffect, useState } from 'react';
import type {
  CreateTaskPayload,
  Task,
  TaskPriority,
  TaskStatus,
  UpdateTaskPayload,
} from '../../services/tasks.service';

interface TaskFormProps {
  task?: Task | null;
  onSubmit: (data: CreateTaskPayload | UpdateTaskPayload) => Promise<void>;
  onClose: () => void;
}

export function TaskForm({ task, onSubmit, onClose }: TaskFormProps) {
  const isEditing = !!task;
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<TaskPriority>('medium');
  const [status, setStatus] = useState<TaskStatus>('pending');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || '');
      setPriority(task.priority);
      setStatus(task.status);
      setDueDate(task.due_date || '');
    }
  }, [task]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await onSubmit({
        title: title.trim(),
        description: description.trim() || undefined,
        priority,
        status,
        due_date: dueDate || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#020617A6] z-40 animate-fade-in"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-[550px] bg-surface-700 border-l border-surface-600 z-50 flex flex-col animate-slide-in">
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full p-6 gap-4"
        >
          {/* Header */}
          <div className="flex flex-col gap-1.5">
            <h2 className="text-text-primary text-2xl font-bold">
              {isEditing ? 'Edit Task' : 'Create Task'}
            </h2>
            <p className="text-text-muted text-[13px]">
              Define scope, ownership, and completion target.
            </p>
          </div>

          {error && (
            <div className="bg-priority-high-bg/50 border border-priority-high-text/20 rounded-input px-3 py-2.5 text-priority-high-text text-[13px]">
              {error}
            </div>
          )}

          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="text-text-label text-xs font-semibold">
              Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full h-[46px] bg-surface-900 rounded-input border border-surface-600 px-3 text-[13px] font-medium text-text-secondary placeholder:text-text-placeholder outline-none focus:border-accent-blue transition-colors"
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <label className="text-text-label text-xs font-semibold">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Include context, acceptance criteria, and dependencies."
              rows={5}
              className="w-full bg-surface-900 rounded-input border border-surface-600 px-3 py-2.5 text-[13px] font-medium text-text-secondary placeholder:text-text-placeholder outline-none focus:border-accent-blue transition-colors resize-none"
            />
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-2">
            <label className="text-text-label text-xs font-semibold">
              Priority
            </label>
            <div className="relative">
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
                className="w-full h-[46px] bg-surface-900 rounded-input border border-surface-600 px-3 text-[13px] font-semibold text-text-secondary outline-none focus:border-accent-blue transition-colors appearance-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none">
                ▾
              </span>
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-2">
            <label className="text-text-label text-xs font-semibold">
              Status
            </label>
            <div className="relative">
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full h-[46px] bg-surface-900 rounded-input border border-surface-600 px-3 text-[13px] font-semibold text-text-secondary outline-none focus:border-accent-blue transition-colors appearance-none cursor-pointer"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm pointer-events-none">
                ▾
              </span>
            </div>
          </div>

          {/* Due Date */}
          <div className="flex flex-col gap-2">
            <label className="text-text-label text-xs font-semibold">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full h-[46px] bg-surface-900 rounded-input border border-surface-600 px-3 text-[13px] font-medium text-text-secondary outline-none focus:border-accent-blue transition-colors cursor-pointer [color-scheme:dark]"
            />
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Actions */}
          <div className="flex justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="h-[42px] px-4 bg-surface-900 rounded-input border border-surface-600 text-text-label text-[13px] font-semibold hover:bg-surface-800 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="h-[42px] px-4 bg-gradient-accent rounded-input text-text-primary text-[13px] font-bold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
