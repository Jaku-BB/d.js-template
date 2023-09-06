# d.js-template

![Build](https://img.shields.io/github/actions/workflow/status/Jaku-BB/d.js-template/test.yml)

This repository is a template for Discord bots using the [discord.js](https://discord.js.org/) library. It allows you to quickly start your own project, without the hassle of initial setup. It is mainly adapted to my needs, but you can easily change it as you wish.

## Features

- interaction handler (application commands, message components and modals) with built-in usage examples
- event handler
- built-in interaction cooldown support
- initial database setup ([Prisma](https://www.prisma.io/))
- [Docker](https://www.docker.com/) setup with [Docker Compose](https://docs.docker.com/compose/)

## Installation

First, create a new repository using this template (**Use this template** button), download it locally, create the `.env` file accordingly to the `.env.example` file and run the database (you can use the `compose.yaml` file for that, but remember to expose port **5432** locally).

After that, just run:

```shell
pnpm install

pnpm dlx prisma migrate deploy
pnpm dlx prisma generate

pnpm run watch
```

To register your application commands, simply run `pnpm run register-application-commands`.

## Examples

You can find usage examples in the `src/handlers` directory. I think that they're pretty self-explanatory.

## Support

For support, reach me on Discord - jaku.bb - or create an issue here.

## License

[MIT](https://github.com/Jaku-BB/d.js-template/blob/main/LICENSE.md)
