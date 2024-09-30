FROM node:lts-alpine3.20 as base

FROM base as build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM base as main

WORKDIR /app

COPY --from=build /app/.next ./.next

COPY --from=build /app/dist ./dist

COPY --from=build /app/package.json ./

RUN npm ci

