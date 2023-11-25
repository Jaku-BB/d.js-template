import { type Client, Events } from 'discord.js';

import type { CooldownMap } from '~/types.js';

import { databaseClient } from '~/utils/database.js';
import { getAllHandlers } from '~/utils/get-all-handlers.js';

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
  const activeCooldowns = await databaseClient['cooldown']['findMany']({
    select: {
      scopeKey: true,
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

  client.cooldowns = new Map();
  client.globalCooldowns = new Map();

  for (const {
    scopeKey,
    interactionKey,
    userId,
    expiresAt,
  } of activeCooldowns) {
    if (scopeKey) {
      if (!client.cooldowns.has(scopeKey)) {
        client.cooldowns.set(scopeKey, new Map());
      }
    }

    const scopeMap = scopeKey
      ? client.cooldowns.get(scopeKey)!
      : client.globalCooldowns;

    if (!scopeMap.has(interactionKey)) {
      scopeMap.set(interactionKey, new Map());
    }

    const cooldownMap =
      scopeMap.get(interactionKey) ?? (new Map() as CooldownMap);

    cooldownMap.set(userId, expiresAt);

    setTimeout(() => {
      cooldownMap.delete(userId);
    }, expiresAt.getTime() - Date.now());
  }
};
