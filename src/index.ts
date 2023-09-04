import { Client, IntentsBitField } from 'discord.js';
import { environment } from './utils/environment.js';
import { initializeCacheData, initializeHandlers } from './initializers.js';

const client = new Client({
  intents: [IntentsBitField.Flags.Guilds],
});

await initializeHandlers(client);
await initializeCacheData(client);

await client.login(environment.DISCORD_BOT_TOKEN);
