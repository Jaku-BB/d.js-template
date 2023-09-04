import type { Snowflake } from 'discord.js';
import type {
  ApplicationCommandInteractionHandler,
  MessageComponentInteractionHandler,
  ModalSubmitInteractionHandler,
} from './structures.js';

declare module 'discord.js' {
  interface Client {
    handlers: {
      applicationCommands: Map<string, ApplicationCommandInteractionHandler>;
      messageComponents: Map<string, MessageComponentInteractionHandler>;
      modalSubmits: Map<string, ModalSubmitInteractionHandler>;
    };
    cooldowns: Map<string, Map<Snowflake, Date>>;
  }
}
