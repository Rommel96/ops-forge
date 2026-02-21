import api from './api';
import type {
  AppPublicTaskPriority,
  AppPublicTaskStatus,
  Task as SharedTask,
} from '@ops-forge/shared-types';

export type TaskStatus = AppPublicTaskStatus;
export type TaskPriority = AppPublicTaskPriority;
export type Task = SharedTask;
export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export const tasksService = {
  getAll: async (status?: TaskStatus): Promise<Task[]> => {
    const params = status ? { status } : {};
    const response = await api.get<Task[]>('/tasks', { params });
    return response.data;
  },

  create: async (data: CreateTaskPayload): Promise<Task> => {
    const response = await api.post<Task>('/tasks', data);
    return response.data;
  },

  update: async (id: string, data: UpdateTaskPayload): Promise<Task> => {
    const response = await api.put<Task>(`/tasks/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/tasks/${id}`);
  },
};
