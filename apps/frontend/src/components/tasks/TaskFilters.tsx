type FilterStatus = 'all' | 'pending' | 'in_progress' | 'completed';

const tabs: { value: FilterStatus; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'pending', label: 'Pending' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' },
];

interface TaskFiltersProps {
  active: FilterStatus;
  onChange: (status: FilterStatus) => void;
}

export function TaskFilters({ active, onChange }: TaskFiltersProps) {
  return (
    <div className="w-full h-[50px] bg-surface-800 rounded-card border border-surface-600 flex items-center gap-2 p-1.5">
      {tabs.map((tab) => (
        <button
          type="button"
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`h-full px-4 rounded-[9px] text-xs font-semibold transition-all cursor-pointer ${
            active === tab.value
              ? 'bg-gradient-accent text-text-primary font-bold shadow-glow'
              : 'bg-transparent text-text-muted hover:bg-surface-700 hover:text-text-label'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
