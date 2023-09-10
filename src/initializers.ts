import { type Client, Events } from 'discord.js';

import { databaseClient } from './utils/database.js';
import { getAllHandlers } from './utils/get-all-handlers.js';

export const initializeHandlers = async (client: Client) => {
  const handlers = await getAllHandlers();

  client.handlers = {
    applicationCommands: new Map(
      handlers.applicationCommands.map((handler) => [
        handler.builder.name,
        handler,
      ]),
    ),
    messageComponents: new Map(
      handlers.messageComponents.map((handler) => [handler.id, handler]),
    ),
    modalSubmits: new Map(
      handlers.modalSubmits.map((handler) => [handler.id, handler]),
    ),
  };

  for (const event of handlers.events) {
    client[event.name === Events.ClientReady ? 'once' : 'on'](
      event.name,
      event.execute,
    );
  }
};

export const initializeCacheData = async (client: Client) => {
  // noinspection JSUnresolvedReference
  const activeCooldowns = await databaseClient.cooldown.findMany({
    select: {
      interactionKey: true,
      userId: true,
      expiresAt: true,
    },
    where: {
      expiresAt: {
        gt: new Date(),
      },
    },
  });

  client.cooldowns = activeCooldowns.reduce<Client['cooldowns']>(
    (cooldowns, { interactionKey, userId, expiresAt }) => {
      const interactionCooldowns = cooldowns.get(interactionKey) ?? new Map();
      interactionCooldowns.set(userId, expiresAt);

      setTimeout(() => {
        interactionCooldowns.delete(userId);
      }, expiresAt.getTime() - Date.now());

      return cooldowns.set(interactionKey, interactionCooldowns);
    },
    new Map(),
  );
};
