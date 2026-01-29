FROM node:22.18.0-alpine3.22 AS base

FROM base AS dependencies

WORKDIR /app

COPY ../packages/db ./packages/db

COPY ../package.json ./package.json

COPY ../package-lock.json ./package-lock.json

RUN npm install

FROM base AS build

WORKDIR /app

COPY --from=dependencies /app/packages/db ./packages/db

COPY --from=dependencies /app/node_modules ./node_modules

COPY --from=dependencies /app/package.json ./package.json

COPY --from=dependencies /app/package-lock.json ./package-lock.json

RUN npm run build:migration --workspace=db

FROM base AS main

WORKDIR /app

COPY --from=build /app/packages/db/dist .

CMD [ "node", "index.js"]

