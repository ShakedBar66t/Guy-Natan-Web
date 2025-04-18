/**
 * A utility for logging that silences logs in production
 * but keeps them in development
 */

const isProduction = process.env.NODE_ENV === 'production';

// Create silent console methods for production
const silentLogger = {
  log: () => {},
  error: () => {},
  warn: () => {},
  info: () => {},
  debug: () => {},
};

// Use actual console in development, silent in production
const logger = isProduction ? silentLogger : console;

export default logger; 