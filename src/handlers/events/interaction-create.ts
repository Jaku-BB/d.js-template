import { Events } from 'discord.js';

import {
  ApplicationCommandInteractionHandler,
  EventHandler,
} from '~/structures.js';
import { log } from '~/utils/logger.js';
import { validateInteraction } from '~/utils/validation/index.js';

// noinspection JSUnusedGlobalSymbols
export default new EventHandler({
  name: Events.InteractionCreate,
  execute: async (interaction) => {
    const { client } = interaction;

    const isCommandInteraction = interaction.isCommand();
    const isAutocompleteInteraction = interaction.isAutocomplete();

    const interactionKey =
      isCommandInteraction || isAutocompleteInteraction
        ? interaction.commandName
        : interaction.customId;

    const handler =
      client.handlers[
        isCommandInteraction || isAutocompleteInteraction
          ? 'applicationCommands'
          : interaction.isMessageComponent()
            ? 'messageComponents'
            : 'modalSubmits'
      ].get(interactionKey);

    if (!handler) {
      return;
    }

    const userId = interaction.user.id;

    try {
      if (isAutocompleteInteraction) {
        const { autocomplete } =
          handler as ApplicationCommandInteractionHandler;

        if (!autocomplete) {
          return;
        }

        return autocomplete(interaction);
      }

      // This function is also responsible for responding to the interaction if there's an error during validation.
      if (
        !(await validateInteraction({
          interactionKey,
          interaction,
          options: handler.options,
        }))
      ) {
        return;
      }

      // TODO: Temporary solution. Find a way to correctly type 'handler' and 'interaction' correlation.
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await handler.execute(interaction);

      log({
        message: 'Ran an interaction handler.',
        data: {
          interactionKey,
          userId,
          isAutocompleteInteraction,
        },
      });
    } catch (error) {
      log({
        message: 'An error occurred while running an interaction handler.',
        data: {
          interactionKey,
          userId,
          isAutocompleteInteraction,
          error,
        },
        level: 'error',
      });

      if (!interaction.isRepliable()) {
        return;
      }

      const followUpOrReply =
        interaction.deferred || interaction.replied ? 'followUp' : 'reply';

      await interaction[followUpOrReply]({
        content:
          'An error occurred while running this interaction. Try again later, please.',
        ephemeral: true,
      });
    }
  },
});
