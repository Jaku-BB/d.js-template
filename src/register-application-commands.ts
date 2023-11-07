import {
  REST,
  type RESTPostAPIChatInputApplicationCommandsJSONBody,
} from 'discord.js';
import { Routes } from 'discord-api-types/v10';
import inquirer from 'inquirer';

import { environment } from '~/utils/environment.js';
import { getAllHandlers } from '~/utils/get-all-handlers.js';
import { log } from '~/utils/logger.js';

type RegistrationType = 'global' | 'guild';

const getRegistrationType = async () => {
  const { type } = (await inquirer.prompt([
    {
      name: 'type',
      message: 'Hello there! What type of registration would you like to do?',
      type: 'list',
      choices: [
        { name: 'Global (all guilds)', value: 'global', checked: true },
        {
          name: 'Guild (based on TEST_GUILD_ID environment variable)',
          value: 'guild',
        },
      ],
    },
  ])) as { type: RegistrationType };

  return type;
};

const getDeleteConfirmation = async () => {
  const { deleteConfirmation } = (await inquirer.prompt([
    {
      name: 'deleteConfirmation',
      message:
        'Do you want to delete all application commands (this is useful in case you rename a command)?',
      type: 'confirm',
    },
  ])) as { deleteConfirmation: boolean };

  return deleteConfirmation;
};

const getRawApplicationCommands = async () => {
  return (await getAllHandlers()).applicationCommands.map(({ builder }) =>
    builder.toJSON(),
  );
};

const registerApplicationCommandsViaAPI = async (
  type: RegistrationType,
  body: RESTPostAPIChatInputApplicationCommandsJSONBody[],
) => {
  const rest = new REST().setToken(environment.DISCORD_BOT_TOKEN);

  await rest.put(
    type === 'global'
      ? Routes.applicationCommands(environment.DISCORD_CLIENT_ID)
      : Routes.applicationGuildCommands(
          environment.DISCORD_CLIENT_ID,
          environment.TEST_GUILD_ID,
        ),
    { body },
  );
};

const registerApplicationCommands = async () => {
  try {
    const type = await getRegistrationType();
    const rawApplicationCommands = await getRawApplicationCommands();

    if (await getDeleteConfirmation()) {
      await registerApplicationCommandsViaAPI(type, []);

      log({
        message: 'Successfully deleted all application commands.',
      });
    }

    await registerApplicationCommandsViaAPI(type, rawApplicationCommands);

    log({
      message: 'Successfully registered application commands.',
      data: { list: rawApplicationCommands.map(({ name }) => name) },
    });
  } catch (error) {
    log({
      message: 'An error occurred while registering application commands.',
      data: { error },
      level: 'error',
    });
  }
};

await registerApplicationCommands();
