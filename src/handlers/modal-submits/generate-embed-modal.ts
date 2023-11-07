import { EmbedBuilder } from 'discord.js';

import { ModalSubmitInteractionHandler } from '~/structures.js';

// noinspection JSUnusedGlobalSymbols
export default new ModalSubmitInteractionHandler({
  id: 'generate-embed-modal',
  options: {},
  execute: async (interaction) => {
    const title = interaction.fields.getTextInputValue('title');
    const description = interaction.fields.getTextInputValue('description');

    const embed = new EmbedBuilder({ title, description });

    if (interaction.inGuild() && interaction.channel) {
      await interaction.channel.send({ embeds: [embed] });
      await interaction.reply({ content: 'Done!', ephemeral: true });

      return;
    }

    await interaction.reply({ embeds: [embed] });
  },
});
