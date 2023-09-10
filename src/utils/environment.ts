import { env as notSafeEnvironment } from 'node:process';
import { object, string } from 'zod';

const environmentSchema = object({
  DISCORD_BOT_TOKEN: string(),
  DISCORD_CLIENT_ID: string(),
  TEST_GUILD_ID: string(),
  DATABASE_URL: string().startsWith('postgresql://'),
});

const result = environmentSchema.safeParse(notSafeEnvironment);

if (!result.success) {
  throw new Error(result.error.message);
}

export const environment = result.data;
