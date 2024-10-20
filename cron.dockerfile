FROM node:lts-alpine3.20 AS base

FROM base AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build:cron

FROM base AS main

WORKDIR /app

COPY --from=build /app/dist/app.js .

CMD [ "node", "app.js"]

