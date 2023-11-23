import {
  type AutocompleteInteraction,
  Events,
  type Interaction,
  inlineCode,
} from 'discord.js';

import {
  ApplicationCommandInteractionHandler,
  EventHandler,
  InteractionHandler,
} from '~/structures.js';
import { databaseClient } from '~/utils/database.js';
import { getRelativeTime } from '~/utils/date.js';
import { log } from '~/utils/logger.js';

const validateInteraction = async ({
  interactionKey,
  interaction,
  options,
}: {
  interactionKey: string;
  interaction: Exclude<Interaction, AutocompleteInteraction>;
  options: InteractionHandler['options'];
}) => {
  const { client, user } = interaction;

  if (options.cooldownDuration && options.cooldownDuration > 0) {
    const MINIMUM_COOLDOWN_TO_SAVE = 60;

    if (!client.cooldowns.has(interactionKey)) {
      client.cooldowns.set(interactionKey, new Map());
    }

    const interactionCooldowns = client.cooldowns.get(interactionKey)!;

    if (!interactionCooldowns.has(user.id)) {
      const cooldownInMilliseconds = options.cooldownDuration * 1000;
      const expiresAt = new Date(Date.now() + cooldownInMilliseconds);

      interactionCooldowns.set(user.id, expiresAt);

      if (options.cooldownDuration >= MINIMUM_COOLDOWN_TO_SAVE) {
        await databaseClient.cooldown.create({
          data: {
            interactionKey,
            userId: user.id,
            expiresAt,
          },
        });
      }

      setTimeout(() => {
        interactionCooldowns.delete(user.id);
      }, cooldownInMilliseconds);

      return true;
    }

    const expiresAt = interactionCooldowns.get(user.id)!;

    await interaction.reply({
      content: `Hold up! Try again ${inlineCode(
        getRelativeTime(expiresAt),
      )}, please.`,
      ephemeral: true,
    });

    return false;
  }

  return true;
};

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
