import axios from 'axios';
import { GenerationRequest, GenerationResult, AppProject, User } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || (
  process.env.NODE_ENV === 'production'
    ? '/api'
    : 'http://localhost:5000/api'
);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 300000, // 5 minutes for long-running AI operations
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API functions
export const generateApp = async (request: GenerationRequest): Promise<GenerationResult> => {
  try {
    const response = await api.post('/generate-app', request);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to generate app');
  }
};

export const saveProject = async (project: Omit<AppProject, 'id' | 'createdAt' | 'updatedAt'>): Promise<AppProject> => {
  try {
    const response = await api.post('/projects', project);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to save project');
  }
};

export const getProjects = async (): Promise<AppProject[]> => {
  try {
    const response = await api.get('/projects');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch projects');
  }
};

export const getProject = async (id: string): Promise<AppProject> => {
  try {
    const response = await api.get(`/projects/${id}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch project');
  }
};

export const updateProject = async (id: string, updates: Partial<AppProject>): Promise<AppProject> => {
  try {
    const response = await api.patch(`/projects/${id}`, updates);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update project');
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await api.delete(`/projects/${id}`);
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete project');
  }
};

export const getCurrentUser = async (): Promise<User> => {
  try {
    const response = await api.get('/user/me');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch user data');
  }
};

export const updateUser = async (updates: Partial<User>): Promise<User> => {
  try {
    const response = await api.patch('/user/me', updates);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update user');
  }
};

export const getUsage = async (): Promise<User['usage']> => {
  try {
    const response = await api.get('/user/usage');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch usage data');
  }
};

// Authentication functions
export const login = async (email: string, password: string): Promise<{ token: string; user: User }> => {
  try {
    const response = await api.post('/auth/login', { email, password });
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    return { token, user };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Login failed');
  }
};

export const register = async (email: string, password: string, name: string): Promise<{ token: string; user: User }> => {
  try {
    const response = await api.post('/auth/register', { email, password, name });
    const { token, user } = response.data;
    localStorage.setItem('authToken', token);
    return { token, user };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Registration failed');
  }
};

export const logout = async (): Promise<void> => {
  try {
    await api.post('/auth/logout');
  } catch (_error) { // error prefixed with _
    // Ignore logout errors
  } finally {
    localStorage.removeItem('authToken');
  }
};

export const refreshToken = async (): Promise<string> => {
  try {
    const response = await api.post('/auth/refresh');
    const { token } = response.data;
    localStorage.setItem('authToken', token);
    return token;
  } catch (error: any) {
    localStorage.removeItem('authToken');
    throw new Error(error.response?.data?.message || 'Token refresh failed');
  }
};

// Framework-specific API calls
export const getFrameworkStatus = async (): Promise<Record<string, boolean>> => {
  try {
    const response = await api.get('/frameworks/status');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch framework status');
  }
};

export const testFramework = async (frameworkId: string): Promise<boolean> => {
  try {
    const response = await api.post(`/frameworks/${frameworkId}/test`);
    return response.data.success;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Framework test failed');
  }
};

// Export the axios instance for custom requests
export default api;
