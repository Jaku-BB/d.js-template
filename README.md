# d.js-template

![Build](https://img.shields.io/github/actions/workflow/status/Jaku-BB/d.js-template/test.yml)

This repository contains a template for building Discord bots in [TypeScript](https://www.typescriptlang.org/) using the [discord.js](https://discord.js.org/) library.
It allows you to quickly start your own project. Note that this template is mostly adapted to my projects, but feel free to contribute.

## Features

- interaction handler (application commands, message components and modals) with usage examples
- event handler
- built-in support for interaction cooldown (global and per guild or direct message)
- environment validation
- separate application commands registration script
- [Docker](https://www.docker.com/) with [Docker Compose](https://docs.docker.com/compose/)

## Requirements

- [Node.js](https://nodejs.org/) >= v20.6.0
- [pnpm](https://pnpm.io/)
- access to a [PostgreSQL](https://www.postgresql.org/) database

## Installation

After creating a new repository using this template, download it locally.
Then, create the `.env` file and fill it according to the `.env.example` file.

If you want to use Docker for your database, feel free to use the `compose.yaml` file.
Just remember to expose port **5432** locally.

To start the bot in development mode, run:

```shell
pnpm install

pnpm dlx prisma migrate dev
pnpm dlx prisma generate

pnpm run watch
```

## Usage

The `src` directory already contains everything you need to start your project.
There are also some examples to help you along the way.

### Your own handler

If you want to add your own handler:

- create a new file in the `handlers` directory
- import the handler class you want to use from `structures.ts`
- instantiate it and export it as the default
- if your handler is an application command handler, remember to register it with `pnpm run register-application-commands`

Simple as that!

> **Note**  
> Keep in mind that any interaction key, whether it's an application command name or a `customId` property, must be unique throughout your bot.

#### Cooldown support

To enable cooldown support in your handler, you need to define either `cooldownDuration` (per guild or direct message) or `globalCooldownDuration` in the `options` object.

By default, each new cooldown is saved to the database if it is equal to or longer than the `MINIMUM_DURATION_TO_SAVE` constant (**60** by default) in the `src/utils/validation/cooldown.ts` file.

```ts
export default new MessageComponentInteractionHandler<ButtonInteraction>({
  id: 'example',
  options: {
    cooldownDuration: 60, // per guild or direct message
    globalCooldownDuration: 60,
  },
  execute: async (interaction) => {
    // Your code goes here...
  },
});
```

> **Note**  
> You can only specify one cooldown scope per handler.

## Support

Be sure to have a look at the [discord.js guide](https://discordjs.guide/) if you need help with the library itself.

If you need support, you can reach me on Discord - **jaku.bb** - or [create a new issue](https://github.com/Jaku-BB/d.js-template/issues) here.

## License

[MIT](https://github.com/Jaku-BB/d.js-template/blob/main/LICENSE.md)
