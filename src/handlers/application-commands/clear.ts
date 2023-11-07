import {
  type ChatInputCommandInteraction,
  type GuildTextBasedChannel,
  PermissionFlagsBits,
  SlashCommandBuilder,
  inlineCode,
} from 'discord.js';

import { ApplicationCommandInteractionHandler } from '~/structures.js';

// noinspection JSUnusedGlobalSymbols
export default new ApplicationCommandInteractionHandler<ChatInputCommandInteraction>(
  {
    builder: new SlashCommandBuilder()
      .setName('clear')
      .setDescription(
        'Filter and delete certain amount of messages from the current text channel.',
      )
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
      .setDMPermission(false)
      .addIntegerOption((option) =>
        option
          .setName('amount')
          .setDescription('Amount of messages to delete.')
          .setMinValue(1)
          .setMaxValue(100)
          .setRequired(true),
      )
      .addUserOption((option) =>
        option
          .setName('user')
          .setDescription('User whose messages to filter for deletion.'),
      ),
    options: {
      cooldownDuration: 60,
    },
    execute: async (interaction) => {
      const { options } = interaction;

      // We can safely assume that the channel is a text channel of a guild because of the 'setDMPermission(false)' above.
      const channel = interaction.channel as GuildTextBasedChannel;

      const amount = options.getInteger('amount', true);
      const userToFilter = options.getUser('user');

      const { size } = await channel.bulkDelete(
        (await channel.messages.fetch())
          .filter(
            (message) =>
              !message.interaction &&
              (!userToFilter || message.author.id === userToFilter.id),
          )
          .first(amount),
        true,
      );

      await interaction.reply({
        content: `Successfully filtered and deleted ${inlineCode(
          size.toString(),
        )} ${
          size === 1 ? 'message' : 'messages'
        } from this channel. Those older than 14 days were skipped due to API limitations.`,
        ephemeral: true,
      });
    },
  },
);
