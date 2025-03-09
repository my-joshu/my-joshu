import pino from 'pino';
import { env } from 'process';

// Configure the logger
const isProduction = env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

// Simpler logger configuration for Next.js compatibility
const loggerConfig = {
  level: isProduction ? 'info' : 'debug',
  // Disable worker threads which can cause issues in Next.js environment
  browser: {
    asObject: true
  }
};

// Create the base logger
const baseLogger = pino(loggerConfig);

// Export a logger instance with enhanced methods
export const logger = {
  info: (obj: any, msg?: string) => {
    if (isDevelopment) {
      console.info(msg || '', obj);
    }
    try {
      baseLogger.info(obj, msg);
    } catch (e) {
      // Silently handle logger errors to prevent app crashes
    }
  },
  error: (obj: any, msg?: string) => {
    if (isDevelopment) {
      console.error(msg || '', obj);
    }
    try {
      baseLogger.error(obj, msg);
    } catch (e) {
      // Silently handle logger errors to prevent app crashes
    }
  },
  warn: (obj: any, msg?: string) => {
    if (isDevelopment) {
      console.warn(msg || '', obj);
    }
    try {
      baseLogger.warn(obj, msg);
    } catch (e) {
      // Silently handle logger errors to prevent app crashes
    }
  },
  debug: (obj: any, msg?: string) => {
    if (isDevelopment) {
      console.debug(msg || '', obj);
    }
    try {
      baseLogger.debug(obj, msg);
    } catch (e) {
      // Silently handle logger errors to prevent app crashes
    }
  }
};
