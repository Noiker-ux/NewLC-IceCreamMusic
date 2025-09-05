FROM node:22.18.0-alpine3.22 AS base

FROM base AS dependencies

WORKDIR /app

COPY package.json .

COPY package-lock.json .

COPY apps/backend/package.json ./apps/backend/package.json

COPY packages/db/package.json ./packages/db/package.json

COPY packages/shared/package.json ./packages/shared/package.json

RUN npm i

FROM base AS build

WORKDIR /app

COPY --from=dependencies /app/node_modules ./node_modules

COPY --from=dependencies /app/package.json ./package.json

COPY --from=dependencies /app/package-lock.json ./package-lock.json

COPY --from=dependencies /app/apps/backend/package.json ./apps/backend/package.json

COPY --from=dependencies /app/packages/db/package.json ./packages/db/package.json

COPY --from=dependencies /app/packages/shared/package.json ./packages/shared/package.json

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

