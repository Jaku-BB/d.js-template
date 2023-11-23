import { readdir as getDirectoryContent } from 'node:fs/promises';
import { join as joinPath } from 'node:path';
import { pathToFileURL } from 'node:url';

import {
  ApplicationCommandInteractionHandler,
  EventHandler,
  MessageComponentInteractionHandler,
  ModalSubmitInteractionHandler,
} from '../structures.js';

const hasProperExtension = (path: string) => {
  return path.endsWith('.js');
};

type Handlers = {
  applicationCommands: ApplicationCommandInteractionHandler[];
  messageComponents: MessageComponentInteractionHandler[];
  modalSubmits: ModalSubmitInteractionHandler[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  events: EventHandler<any>[];
};

export const getAllHandlers = async () => {
  const handlers: Handlers = {
    applicationCommands: [],
    messageComponents: [],
    modalSubmits: [],
    events: [],
  };

  const directoryURL = new URL('../handlers/', import.meta.url);

  try {
    for (const fileOrDirectory of await getDirectoryContent(directoryURL, {
      withFileTypes: true,
      recursive: true,
    })) {
      const { name, path } = fileOrDirectory;

      if (!fileOrDirectory.isFile() || !hasProperExtension(name)) {
        continue;
      }

      const filePath = pathToFileURL(joinPath(path, name)).toString();
      const { default: handler } = await import(filePath);

      switch (true) {
        case handler instanceof ApplicationCommandInteractionHandler:
          handlers.applicationCommands.push(handler);
          break;

        case handler instanceof MessageComponentInteractionHandler:
          handlers.messageComponents.push(handler);
          break;

        case handler instanceof ModalSubmitInteractionHandler:
          handlers.modalSubmits.push(handler);
          break;

        case handler instanceof EventHandler:
          handlers.events.push(handler);
          break;
      }
    }
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (error instanceof Error && (error as any)['code'] === 'EN0ENT') {
      return handlers;
    }

    throw error;
  }

  return handlers;
};
