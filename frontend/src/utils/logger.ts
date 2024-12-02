import { AxiosError, AxiosResponse } from 'axios';

// Log levels
export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR'
}

// Logger class for frontend logging
class Logger {
    private static instance: Logger;
    private isDevelopment: boolean;

    private constructor() {
        this.isDevelopment = process.env.NODE_ENV === 'development';
    }

    public static getInstance(): Logger {
        if (!Logger.instance) {
            Logger.instance = new Logger();
        }
        return Logger.instance;
    }

    private formatMessage(level: LogLevel, message: string, data?: any): string {
        const timestamp = new Date().toISOString();
        return `[${timestamp}] ${level}: ${message}${data ? ' - ' + JSON.stringify(data) : ''}`;
    }

    private log(level: LogLevel, message: string, data?: any) {
        const formattedMessage = this.formatMessage(level, message, data);
        
        switch (level) {
            case LogLevel.DEBUG:
                if (this.isDevelopment) {
                    console.debug(formattedMessage);
                }
                break;
            case LogLevel.INFO:
                console.info(formattedMessage);
                break;
            case LogLevel.WARN:
                console.warn(formattedMessage);
                break;
            case LogLevel.ERROR:
                console.error(formattedMessage);
                break;
        }
    }

    public debug(message: string, data?: any) {
        this.log(LogLevel.DEBUG, message, data);
    }

    public info(message: string, data?: any) {
        this.log(LogLevel.INFO, message, data);
    }

    public warn(message: string, data?: any) {
        this.log(LogLevel.WARN, message, data);
    }

    public error(message: string, data?: any) {
        this.log(LogLevel.ERROR, message, data);
    }

    // API request logging
    public logApiRequest(method: string, url: string, data?: any) {
        this.debug(`API Request: ${method} ${url}`, data);
    }

    public logApiResponse(response: AxiosResponse) {
        this.debug(`API Response: ${response.config.method?.toUpperCase()} ${response.config.url}`, {
            status: response.status,
            data: response.data
        });
    }

    public logApiError(error: AxiosError) {
        this.error(`API Error: ${error.config?.method?.toUpperCase()} ${error.config?.url}`, {
            status: error.response?.status,
            data: error.response?.data,
            message: error.message
        });
    }
}

export const logger = Logger.getInstance();
