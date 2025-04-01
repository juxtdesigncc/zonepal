// Allow overriding isDev mode for debugging
let isDev = process.env.NODE_ENV === 'development';

// Function to override isDev mode
export const setLoggerDevMode = (enabled: boolean) => {
  isDev = enabled;
};

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogStyles {
  debug: string;
  info: string;
  warn: string;
  error: string;
}

const styles: LogStyles = {
  debug: 'color: #666',
  info: 'color: #0070f3',
  warn: 'color: #f5a623',
  error: 'color: #dc2626'
};

type LogArgs = (string | number | boolean | null | undefined | object)[];

export const logger = {
  debug: (...args: LogArgs) => {
    if (isDev) {
      console.debug('%c[debug]', styles.debug, ...args);
    }
  },
  
  info: (...args: LogArgs) => {
    if (isDev) {
      console.info('%c[info]', styles.info, ...args);
    }
  },
  
  warn: (...args: LogArgs) => {
    if (isDev) {
      console.warn('%c[warn]', styles.warn, ...args);
    }
  },
  
  error: (...args: LogArgs) => {
    // Always log errors, even in production
    console.error('%c[error]', styles.error, ...args);
  },
  
  group: (name: string, level: LogLevel = 'debug') => {
    if (isDev) {
      console.group(`%c[${name}]`, styles[level]);
    }
  },
  
  groupEnd: () => {
    if (isDev) {
      console.groupEnd();
    }
  },

  setLoggerDevMode
};

// Add type declaration for window.logger
declare global {
  interface Window {
    logger: typeof logger;
  }
}

// Expose logger to window object in non-SSR environment
if (typeof window !== 'undefined') {
  window.logger = logger;
} 