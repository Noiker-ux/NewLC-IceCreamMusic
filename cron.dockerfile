FROM node:lts-alpine3.20 AS base

FROM base AS build

WORKDIR /app

COPY . .

# COPY ./server.ts .

# COPY ./db ./db

# COPY ./config ./config

# COPY ./utils ./utils

# COPY ./package.json .

# COPY ./package-lock.json .

# COPY ./tsconfig.json .

# COPY ./tsconfig.server.json .

# COPY ./webpack.config.js .

# COPY ./schema ./schema

# COPY ./helpers ./helpers

RUN npm install

RUN npm run build:cron

FROM base AS main

WORKDIR /app

COPY --from=build /app/dist/app.js .

CMD [ "node", "app.js"]

