import type { Snowflake } from 'discord.js';

import type {
  ApplicationCommandInteractionHandler,
  MessageComponentInteractionHandler,
  ModalSubmitInteractionHandler,
} from '~/structures.js';

export type CooldownMap = Map<Snowflake, Date>;

declare module 'discord.js' {
  interface Client {
    handlers: {
      applicationCommands: Map<string, ApplicationCommandInteractionHandler>;
      messageComponents: Map<string, MessageComponentInteractionHandler>;
      modalSubmits: Map<string, ModalSubmitInteractionHandler>;
    };
    cooldowns: Map<Snowflake, Map<string, CooldownMap>>;
    globalCooldowns: Map<string, CooldownMap>;
  }
}
