import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { AuthResponse, LoginCredentials, RegisterData, Task, User } from '../types';

// API routes configuration
export const API_ROUTES = {
    AUTH: {
        LOGIN: '/api/auth/login',
        REGISTER: '/api/auth/register',
        REFRESH: '/api/auth/refresh',
        LOGOUT: '/api/auth/logout',
        PROFILE: '/api/auth/profile'
    },
    TASKS: {
        BASE: '/api/tasks',
        STATS: '/api/tasks/stats',
    },
    PROJECTS: {
        BASE: '/api/projects',
    },
    LOGS: {
        BASE: '/api/logs',
    },
    MINDMAPS: {
        BASE: '/api/mindmaps',
    },
    CONCEPTS: {
        BASE: '/api/concepts',
    },
    IDEAS: {
        BASE: '/api/ideas',
    },
    JOURNALS: {
        BASE: '/api/journals',
        LIST: '/api/journals',
        CREATE: '/api/journals'
    }
};

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true,
    timeout: 30000, // 30 seconds
});

// Add request interceptor for authentication and debugging
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Add authorization header if token exists
        const token = localStorage.getItem('access_token');
        if (token && config.headers) {
            config.headers['Authorization'] = `Bearer ${token}`;
            // Ensure credentials are included
            config.withCredentials = true;
        }

        // Log request for debugging
        console.log('API Request:', {
            method: config.method,
            url: config.url,
            headers: config.headers,
        });

        return config;
    },
    (error) => {
        console.error('Request error:', error);
        return Promise.reject(error);
    }
);

// Add response interceptor for error handling and token refresh
let isRefreshing = false;
let failedQueue: Array<{
    resolve: (value?: unknown) => void;
    reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any | null, token: string | null = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config as ExtendedAxiosRequestConfig;

        // Don't retry if:
        // 1. It's not a 401 error
        // 2. It's already been retried
        // 3. It's a refresh token request
        // 4. It's a login request
        if (
            error.response?.status !== 401 ||
            originalRequest._retry ||
            originalRequest.url === API_ROUTES.AUTH.REFRESH ||
            originalRequest.url === API_ROUTES.AUTH.LOGIN
        ) {
            return Promise.reject(error);
        }

        if (isRefreshing) {
            try {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then(token => {
                    if (token && originalRequest.headers) {
                        originalRequest.headers['Authorization'] = `Bearer ${token}`;
                    }
                    return api(originalRequest);
                }).catch(err => {
                    return Promise.reject(err);
                });
            } catch (err) {
                return Promise.reject(err);
            }
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (!refreshToken) {
                processQueue(new Error('No refresh token available'), null);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                window.location.href = '/login';
                return Promise.reject(new Error('No refresh token available'));
            }

            try {
                const response = await auth.refreshToken(refreshToken);
                const newToken = response.access_token;
                
                localStorage.setItem('access_token', newToken);
                if (response.refresh_token) {
                    localStorage.setItem('refresh_token', response.refresh_token);
                }

                if (originalRequest.headers) {
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                }

                processQueue(null, newToken);
                return api(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                // Only redirect if we're not already on the login page
                if (!window.location.pathname.includes('/login')) {
                    window.location.href = '/login';
                }
                return Promise.reject(refreshError);
            }
        } catch (err) {
            processQueue(err, null);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            window.location.href = '/login';
            return Promise.reject(err);
        } finally {
            isRefreshing = false;
        }
    }
);

// Extended type for request config with _retry property
interface ExtendedAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean;
}

// API functions
export const register = async (data: RegisterData): Promise<AuthResponse> => {
    console.log('Sending registration request with data:', data);
    try {
        const response = await api.post<AuthResponse>(API_ROUTES.AUTH.REGISTER, data);
        return response.data;
    } catch (error) {
        console.error('Registration error:', error);
        console.log('Response data:', (error as AxiosError)?.response?.data);
        console.log('Response status:', (error as AxiosError)?.response?.status);
        console.log('Response headers:', (error as AxiosError)?.response?.headers);
        throw error;
    }
};

export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);
    return response.data;
};

export const refreshToken = async (refreshToken: string): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>(API_ROUTES.AUTH.REFRESH, { refresh_token: refreshToken });
    return response.data;
};

export const getTasks = async (): Promise<Task[]> => {
    const response = await api.get<Task[]>(API_ROUTES.TASKS.BASE);
    return response.data;
};

export const createTask = async (task: Partial<Task>): Promise<Task> => {
    const response = await api.post<Task>(API_ROUTES.TASKS.BASE, task);
    return response.data;
};

export const updateTask = async (taskId: number, task: Partial<Task>): Promise<Task> => {
    const response = await api.put<Task>(`${API_ROUTES.TASKS.BASE}/${taskId}`, task);
    return response.data;
};

export const deleteTask = async (taskId: number): Promise<void> => {
    await api.delete(`${API_ROUTES.TASKS.BASE}/${taskId}`);
};

export const getTaskStats = async (): Promise<any> => {
    const response = await api.get(API_ROUTES.TASKS.STATS);
    return response.data;
};

export const auth = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>(API_ROUTES.AUTH.LOGIN, credentials);
        return response.data;
    },

    register(data: RegisterData): Promise<AuthResponse> {
        return api.post(API_ROUTES.AUTH.REGISTER, data).then(response => response.data);
    },

    getProfile(): Promise<User> {
        return api.get(API_ROUTES.AUTH.PROFILE).then(response => response.data);
    },

    logout(): Promise<void> {
        const refreshToken = localStorage.getItem('refresh_token');
        if (!refreshToken) {
            // If no refresh token, just clear local storage and return
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            return Promise.resolve();
        }
        return api.post(API_ROUTES.AUTH.LOGOUT, { refresh_token: refreshToken })
            .then(response => {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                return response.data;
            })
            .catch(error => {
                // Still clear tokens even if request fails
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                throw error;
            });
    },

    refreshToken(refreshToken: string): Promise<AuthResponse> {
        return api.post(API_ROUTES.AUTH.REFRESH, { refresh_token: refreshToken }).then(response => response.data);
    }
};

export const tasks = {
    getAll: async (): Promise<Task[]> => {
        const response = await api.get<Task[]>(API_ROUTES.TASKS.BASE);
        return response.data;
    },

    getById: async (id: number): Promise<Task> => {
        const response = await api.get<Task>(`${API_ROUTES.TASKS.BASE}/${id}`);
        return response.data;
    },

    create: async (task: Partial<Task>): Promise<Task> => {
        const response = await api.post<Task>(API_ROUTES.TASKS.BASE, task);
        return response.data;
    },

    update: async (id: number, task: Partial<Task>): Promise<Task> => {
        const response = await api.put<Task>(`${API_ROUTES.TASKS.BASE}/${id}`, task);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`${API_ROUTES.TASKS.BASE}/${id}`);
    },
};

export const apiClient = api;
