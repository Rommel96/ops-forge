import type { Task } from '../../services/tasks.service';

const priorityStyles: Record<string, { bg: string; text: string }> = {
  low: { bg: 'bg-priority-low-bg', text: 'text-priority-low-text' },
  medium: { bg: 'bg-priority-medium-bg', text: 'text-priority-medium-text' },
  high: { bg: 'bg-priority-high-bg', text: 'text-priority-high-text' },
};

const statusStyles: Record<string, { bg: string; text: string }> = {
  pending: { bg: 'bg-status-pending-bg', text: 'text-status-pending-text' },
  in_progress: {
    bg: 'bg-status-progress-bg',
    text: 'text-status-progress-text',
  },
  completed: {
    bg: 'bg-status-completed-bg',
    text: 'text-status-completed-text',
  },
};

const statusLabels: Record<string, string> = {
  pending: 'Pending',
  in_progress: 'In Progress',
  completed: 'Completed',
};

const priorityLabels: Record<string, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

function formatDate(dateStr: string | null): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

export function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const pStyle = priorityStyles[task.priority] || priorityStyles.medium;
  const sStyle = statusStyles[task.status] || statusStyles.pending;

  return (
    <div className="bg-surface-700 rounded-card border border-surface-600 shadow-card p-4 flex flex-col gap-3 hover:border-accent-blue/30 transition-colors group">
      {/* Title + Actions */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-text-secondary text-sm font-semibold leading-snug flex-1">
          {task.title}
        </h3>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => onEdit(task)}
            className="w-7 h-7 rounded-lg bg-surface-800 border border-surface-600 flex items-center justify-center text-text-muted hover:text-accent-blue hover:border-accent-blue/50 transition-colors text-xs"
            title="Edit"
          >
            ✎
          </button>
          <button
            type="button"
            onClick={() => onDelete(task)}
            className="w-7 h-7 rounded-lg bg-surface-800 border border-surface-600 flex items-center justify-center text-text-muted hover:text-priority-high-text hover:border-priority-high-bg transition-colors text-xs"
            title="Delete"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Badges */}
      <div className="flex gap-2">
        <span
          className={`${pStyle.bg} ${pStyle.text} text-[11px] font-bold px-2.5 py-1 rounded-full`}
        >
          {priorityLabels[task.priority]}
        </span>
        <span
          className={`${sStyle.bg} ${sStyle.text} text-[11px] font-bold px-2.5 py-1 rounded-full`}
        >
          {statusLabels[task.status]}
        </span>
      </div>

      {/* Meta */}
      <p className="text-text-muted text-xs font-medium">
        {task.due_date ? `Due: ${formatDate(task.due_date)} • ` : ''}
        Owner: {task.owner?.username || 'Unknown'}
      </p>
    </div>
  );
}
