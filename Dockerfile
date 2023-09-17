FROM node:20.6.0-bookworm-slim as builder

WORKDIR /usr/src/app

COPY . .

# It's necessary for '@prisma/client' to work properly.
RUN apt-get update --yes && apt-get install --yes openssl

RUN npm install --global pnpm

RUN pnpm install --frozen-lockfile
RUN pnpm run build
RUN pnpm prune --config.production --config.ignore-scripts=true

RUN rm -R ./src ./tsconfig.json

FROM node:20.6.0-bookworm-slim

WORKDIR /usr/src/app

# It's necessary for '@prisma/client' to work properly.
RUN apt-get update --yes && apt-get install --yes openssl

RUN npm install --global pnpm

COPY --from=builder /usr/src/app .

ENTRYPOINT ["pnpm", "run", "start:migrate"]
