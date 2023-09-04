import { Events } from 'discord.js';
import { Cron } from 'croner';
import { EventHandler } from '../../structures.js';
import { log } from '../../utils/logger.js';
import { databaseClient } from '../../utils/database.js';

// noinspection JSUnusedGlobalSymbols
export default new EventHandler({
  name: Events.ClientReady,
  execute: async () => {
    log({ message: 'Client is ready!' });

    // Delete expired cooldowns every 5 minutes.
    Cron('*/5 * * * *', async () => {
      // noinspection JSUnresolvedReference
      await databaseClient.cooldown.deleteMany({
        where: {
          expiresAt: {
            lt: new Date(),
          },
        },
      });
    });
  },
});
