import * as winston from 'winston';

namespace Logger {
  function level() {
    const env = process.env.NODE_ENV || 'local';
    const isDevelopment = env === 'local';
    return isDevelopment ? 'debug' : 'warn';
  }

  const colors = {
    error: 'red',
    warn: 'yellow',
    info: 'green',
    http: 'magenta',
    debug: 'white',
  };

  winston.addColors(colors);

  export function getLogger(module: string) {
    const levels = {
      error: 0,
      warn: 1,
      info: 2,
      http: 3,
      debug: 4,
    };

    const format = winston.format.combine(
      winston.format.label({ label: module }),
      winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
      winston.format.colorize({ all: true }),
      winston.format.printf((info) => `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`)
    );

    const transports = [
      new winston.transports.Console(),
      new winston.transports.File({
        filename: 'logs/error.log',
        level: 'error',
      }),
      new winston.transports.File({ filename: 'logs/all.log' }),
    ];

    const logger = winston.createLogger({
      level: level(),
      levels,
      format,
      transports,
    });

    return logger;
  }
}

export interface ILogger extends winston.Logger {}

export default Logger;
