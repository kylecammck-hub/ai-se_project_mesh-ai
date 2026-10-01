import winston from 'winston';

const isProduction = process.env.NODE_ENV === 'production';

export const logger = winston.createLogger({
  level: isProduction ? 'info' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    isProduction
      ? winston.format.json()
      : winston.format.printf(({ timestamp, level, message, stack }) =>
          `${timestamp} ${level}: ${message}${stack ? `\n${stack}` : ''}`,
        ),
  ),
  transports: [new winston.transports.Console()],
});
