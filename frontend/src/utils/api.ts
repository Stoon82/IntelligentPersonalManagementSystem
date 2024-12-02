import axios from 'axios';
import { logger } from './logger';

// Function to send logs to logging server
const sendToLoggingServer = async (logData: any) => {
    try {
        await axios.post('http://localhost:4000/log', logData, {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Failed to send log to logging server:', error);
    }
};

// Create axios instance with base configuration
const api = axios.create({
    baseURL: 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

// Request interceptor
api.interceptors.request.use(
    async (config) => {
        const requestData = {
            type: 'REQUEST',
            timestamp: new Date().toISOString(),
            method: config.method?.toUpperCase() || 'UNKNOWN',
            url: config.url,
            headers: config.headers,
            data: config.data
        };

        // Log to console and file
        logger.logApiRequest(
            config.method?.toUpperCase() || 'UNKNOWN',
            config.url || 'UNKNOWN',
            config.data
        );
        await sendToLoggingServer(requestData);

        // Get the token from localStorage
        const token = localStorage.getItem('access_token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    async (error) => {
        const errorData = {
            type: 'REQUEST_ERROR',
            timestamp: new Date().toISOString(),
            error: error.message,
            stack: error.stack
        };

        logger.logApiError(error);
        await sendToLoggingServer(errorData);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    async (response) => {
        const responseData = {
            type: 'RESPONSE',
            timestamp: new Date().toISOString(),
            status: response.status,
            statusText: response.statusText,
            headers: response.headers,
            data: response.data,
            url: response.config.url
        };

        // Log to console and file
        logger.logApiResponse(response);
        await sendToLoggingServer(responseData);
        return response;
    },
    async (error) => {
        const errorData = {
            type: 'RESPONSE_ERROR',
            timestamp: new Date().toISOString(),
            status: error.response?.status,
            statusText: error.response?.statusText,
            error: error.message,
            url: error.config?.url,
            data: error.response?.data
        };

        logger.logApiError(error);
        await sendToLoggingServer(errorData);

        if (error.response?.status === 401) {
            localStorage.removeItem('access_token');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;
