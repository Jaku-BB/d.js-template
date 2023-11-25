import type { AutocompleteInteraction, Interaction } from 'discord.js';

import type { InteractionHandlerOptions } from '~/structures.js';

import { validateInteractionCooldown } from '~/utils/validation/cooldown.js';

export type InteractionValidationData = {
  interactionKey: string;
  interaction: Exclude<Interaction, AutocompleteInteraction>;
  options: InteractionHandlerOptions;
};

export const validateInteraction = async ({
  interactionKey,
  interaction,
  options,
}: InteractionValidationData) => {
  const { cooldownDuration, globalCooldownDuration } = options;

  if (cooldownDuration || globalCooldownDuration) {
    return validateInteractionCooldown({
      interactionKey,
      interaction,
      duration: (cooldownDuration || globalCooldownDuration) as number,
      isGlobal: !!globalCooldownDuration,
    });
  }

  return true;
};
