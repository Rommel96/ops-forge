import type { AppPublicTasks, AppPublicUsers } from './db.generated';

// Re-export generated types
export * from './db.generated';

// ============================================================
// Enums / Constants
// ============================================================

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
}

// ============================================================
// Entity Mappings (Frontend/API views)
// ============================================================

/**
 * User as seen by the API / Frontend
 */
export interface User
  extends Omit<AppPublicUsers, 'id' | 'created_at' | 'updated_at'> {
  id: string;
  created_at: string;
  updated_at: string;
}

/**
 * Task as seen by the API / Frontend (includes owner relation)
 */
export interface Task
  extends Omit<
    AppPublicTasks,
    'id' | 'created_at' | 'updated_at' | 'due_date' | 'status' | 'priority'
  > {
  id: string;
  status: TaskStatus;
  priority: TaskPriority;
  due_date: string | null;
  created_at: string;
  updated_at: string;
  owner?: User;
}

// ============================================================
// DTOs
// ============================================================

export interface CreateTaskDto {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string | null;
  status?: TaskStatus;
  priority?: TaskPriority;
  due_date?: string | null;
}

export interface FilterTaskDto {
  status?: TaskStatus;
}

export interface LoginDto {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: User;
}

// ============================================================
// API Response Wrappers
// ============================================================

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface ApiErrorResponse {
  statusCode: number;
  message: string;
  errors?: string[];
  timestamp: string;
}
