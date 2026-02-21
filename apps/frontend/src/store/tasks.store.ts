import { create } from 'zustand';
import {
  type CreateTaskPayload,
  type Task,
  type TaskStatus,
  tasksService,
  type UpdateTaskPayload,
} from '../services/tasks.service';

type FilterStatus = TaskStatus | 'all';

interface TasksState {
  tasks: Task[];
  filter: FilterStatus;
  loading: boolean;
  error: string | null;
  setFilter: (filter: FilterStatus) => void;
  fetchTasks: () => Promise<void>;
  createTask: (data: CreateTaskPayload) => Promise<void>;
  updateTask: (id: string, data: UpdateTaskPayload) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export const useTasksStore = create<TasksState>((set, get) => ({
  tasks: [],
  filter: 'all',
  loading: false,
  error: null,

  setFilter: (filter) => {
    set({ filter });
    get().fetchTasks();
  },

  fetchTasks: async () => {
    set({ loading: true, error: null });
    try {
      const filter = get().filter;
      const status = filter === 'all' ? undefined : filter;
      const tasks = await tasksService.getAll(status);
      set({ tasks, loading: false });
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to fetch tasks',
        loading: false,
      });
    }
  },

  createTask: async (data) => {
    set({ loading: true, error: null });
    try {
      await tasksService.create(data);
      await get().fetchTasks();
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to create task',
        loading: false,
      });
      throw err;
    }
  },

  updateTask: async (id, data) => {
    set({ loading: true, error: null });
    try {
      await tasksService.update(id, data);
      await get().fetchTasks();
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to update task',
        loading: false,
      });
      throw err;
    }
  },

  deleteTask: async (id) => {
    set({ loading: true, error: null });
    try {
      await tasksService.delete(id);
      await get().fetchTasks();
    } catch (err: any) {
      set({
        error: err.response?.data?.message || 'Failed to delete task',
        loading: false,
      });
      throw err;
    }
  },
}));
