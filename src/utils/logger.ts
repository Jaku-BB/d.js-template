import { pino } from 'pino';

const logger = pino({
  customLevels: {
    debug: 10,
    information: 20,
    error: 30,
  },
  useOnlyCustomLevels: true,
  errorKey: 'error',
  messageKey: 'message',
  level: 'debug',
});

export const log = ({
  message,
  data,
  level = 'information',
}: {
  message: string;
  data?: Record<string, unknown>;
  level?: 'debug' | 'error' | 'information';
}) => {
  logger[level](data, message);
};
