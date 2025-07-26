FROM node:22.16.0-alpine AS base

FROM base AS build

WORKDIR /app

COPY package.json .

COPY package-lock.json .

COPY apps/backend/package.json ./apps/backend/package.json

COPY packages/db/package.json ./packages/db/package.json

COPY packages/shared/package.json ./packages/shared/package.json

RUN npm i

COPY packages/db ./packages/db

COPY packages/shared ./packages/shared

COPY apps/backend ./apps/backend

RUN npm run build --workspace=db

RUN npm run build --workspace=shared

RUN npm run build --workspace=backend

FROM base AS main

WORKDIR /app

COPY --from=build /app/apps/backend/dist/server.js .

EXPOSE 5000

CMD [ "node", "server.js"]

