import type {
  AnySelectMenuInteraction,
  AutocompleteInteraction,
  BaseInteraction,
  ButtonInteraction,
  ChatInputCommandInteraction,
  ClientEvents,
  MessageContextMenuCommandInteraction,
  ModalSubmitInteraction,
  SlashCommandBuilder,
  UserContextMenuCommandInteraction,
} from 'discord.js';

type AnyApplicationCommandInteraction =
  | ChatInputCommandInteraction
  | MessageContextMenuCommandInteraction
  | UserContextMenuCommandInteraction;

type AnyMessageComponentInteraction =
  | AnySelectMenuInteraction
  | ButtonInteraction;

type OptionsWithCooldown = {
  cooldownDuration?: number;
  globalCooldownDuration?: never;
};

type OptionsWithGlobalCooldown = {
  cooldownDuration?: never;
  globalCooldownDuration?: number;
};

export type InteractionHandlerOptions =
  | OptionsWithCooldown
  | OptionsWithGlobalCooldown;

export abstract class InteractionHandler<
  T extends BaseInteraction = BaseInteraction,
> {
  public readonly options: InteractionHandlerOptions;
  public readonly execute: (interaction: T) => Promise<void>;

  protected constructor({ options, execute }: InteractionHandler<T>) {
    this.options = options;
    this.execute = execute;
  }
}

export class ApplicationCommandInteractionHandler<
  T extends AnyApplicationCommandInteraction = AnyApplicationCommandInteraction,
> extends InteractionHandler<T> {
  public readonly builder:
    | Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>
    | SlashCommandBuilder;
  public readonly autocomplete?: (
    interaction: AutocompleteInteraction,
  ) => Promise<void>;

  public constructor({
    builder,
    autocomplete,
    options,
    execute,
  }: ApplicationCommandInteractionHandler<T>) {
    super({ options, execute });
    this.builder = builder;
    this.autocomplete = autocomplete;
  }
}

export class MessageComponentInteractionHandler<
  T extends AnyMessageComponentInteraction = AnyMessageComponentInteraction,
> extends InteractionHandler<T> {
  public readonly id: string;

  public constructor({
    id,
    options,
    execute,
  }: MessageComponentInteractionHandler<T>) {
    super({ options, execute });
    this.id = id;
  }
}

export class ModalSubmitInteractionHandler extends InteractionHandler<ModalSubmitInteraction> {
  public readonly id: string;

  public constructor({ id, options, execute }: ModalSubmitInteractionHandler) {
    super({ options, execute });
    this.id = id;
  }
}

export class EventHandler<T extends keyof ClientEvents> {
  public readonly name: T;
  public readonly execute: (...eventArgs: ClientEvents[T]) => void;

  public constructor({ name, execute }: EventHandler<T>) {
    this.name = name;
    this.execute = execute;
  }
}
