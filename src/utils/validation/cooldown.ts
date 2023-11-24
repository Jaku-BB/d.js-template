import { inlineCode } from 'discord.js';

import type { InteractionValidationData } from '~/utils/validation/index.js';

import { databaseClient } from '~/utils/database.js';
import { getRelativeTime } from '~/utils/date.js';

const MINIMUM_DURATION_TO_SAVE = 60;

const replyWithRemainingDuration = async (
  interaction: InteractionValidationData['interaction'],
  expiresAt: Date,
) => {
  await interaction.reply({
    content: `Hold up! Try again ${inlineCode(
      getRelativeTime(expiresAt),
    )}, please.`,
    ephemeral: true,
  });
};

export const validateInteractionCooldown = async ({
  interactionKey,
  interaction,
  duration,
  isGlobal,
}: {
  interactionKey: InteractionValidationData['interactionKey'];
  interaction: InteractionValidationData['interaction'];
  duration: number;
  isGlobal: boolean;
}) => {
  const { client, user } = interaction;
  const interactionGuildIdOrDM = interaction.guildId ?? 'DM';

  if (!isGlobal && !client.cooldowns.has(interactionGuildIdOrDM)) {
    client.cooldowns.set(interactionGuildIdOrDM, new Map());
  }

  const scopeMap = isGlobal
    ? client.globalCooldowns
    : client.cooldowns.get(interactionGuildIdOrDM)!;

  if (!scopeMap.has(interactionKey)) {
    scopeMap.set(interactionKey, new Map());
  }

  const cooldownMap = scopeMap.get(interactionKey)!;

  if (!cooldownMap.has(user.id)) {
    const durationInMilliseconds = duration * 1000;
    const expiresAt = new Date(Date.now() + durationInMilliseconds);

    cooldownMap.set(user.id, expiresAt);

    if (duration >= MINIMUM_DURATION_TO_SAVE) {
      await databaseClient['cooldown'].create({
        data: {
          scopeKey: isGlobal ? null : interactionGuildIdOrDM,
          interactionKey,
          userId: user.id,
          expiresAt,
        },
      });
    }

    setTimeout(() => {
      cooldownMap.delete(user.id);
    }, durationInMilliseconds);

    return true;
  }

  await replyWithRemainingDuration(interaction, cooldownMap.get(user.id)!);

  return false;
};
