import api from './api';
import type {
  LoginDto as LoginPayload,
  LoginResponse as SharedLoginResponse,
} from '@ops-forge/shared-types';

export type LoginResponse = SharedLoginResponse;

export const authService = {
  login: async (data: LoginPayload): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>('/login', data);
    return response.data;
  },
};
