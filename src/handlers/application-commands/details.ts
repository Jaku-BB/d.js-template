import {
  type ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
  SlashCommandBuilder,
  bold,
} from 'discord.js';
import { memoryUsage } from 'node:process';

import { ApplicationCommandInteractionHandler } from '~/structures.js';

// noinspection JSUnusedGlobalSymbols
export default new ApplicationCommandInteractionHandler<ChatInputCommandInteraction>(
  {
    builder: new SlashCommandBuilder()
      .setName('details')
      .setDescription('Display details about me.'),
    options: {},
    execute: async (interaction) => {
      const memoryUsageInMegabytes = (
        memoryUsage().heapUsed /
        1024 /
        1024
      ).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });

      await interaction.reply({
        embeds: [
          new EmbedBuilder()
            .setTitle('Details')
            .setDescription(
              `- Guilds I'm in: ${bold(
                interaction.client.guilds.cache.size.toString(10),
              )}\n- How much memory I'm currently using: ${bold(
                memoryUsageInMegabytes,
              )} MB`,
            )
            .setColor(Colors.LuminousVividPink),
        ],
        ephemeral: true,
      });
    },
  },
);
