import {
  ActionRowBuilder,
  type ChatInputCommandInteraction,
  type ModalActionRowComponentBuilder,
  ModalBuilder,
  PermissionFlagsBits,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';

import { ApplicationCommandInteractionHandler } from '~/structures.js';

// noinspection JSUnusedGlobalSymbols
export default new ApplicationCommandInteractionHandler<ChatInputCommandInteraction>(
  {
    builder: new SlashCommandBuilder()
      .setName('generate-embed')
      .setDescription('Generate an embed with custom title and description.')
      .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
    options: {},
    execute: async (interaction) => {
      await interaction.showModal(
        new ModalBuilder()
          .setCustomId('generate-embed-modal')
          .setTitle('Embed')
          .addComponents(
            new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId('title')
                .setLabel('Title')
                .setStyle(TextInputStyle.Short)
                .setMinLength(1)
                .setMaxLength(256),
            ),
            new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(
              new TextInputBuilder()
                .setCustomId('description')
                .setLabel('Description')
                .setStyle(TextInputStyle.Paragraph)
                .setMinLength(1)
                .setMaxLength(2048),
            ),
          ),
      );
    },
  },
);
