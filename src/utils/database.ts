import { PrismaClient } from '@prisma/client';

import { log } from '~/utils/logger.js';

export const databaseClient = new PrismaClient({
  log: [
    {
      emit: 'event',
      level: 'query',
    },
  ],
});

// noinspection JSUnresolvedReference
databaseClient.$on('query', ({ query, duration }) => {
  log({
    message: query,
    data: { duration },
    level: 'debug',
  });
});
