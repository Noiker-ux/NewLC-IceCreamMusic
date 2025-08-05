FROM node:22.16.0-alpine AS base

FROM base AS build

WORKDIR /app

COPY package.json .

COPY package-lock.json .

COPY apps/backend/package.json ./apps/backend/package.json

COPY apps/frontend/package.json ./apps/frontend/package.json

COPY packages/sdk/package.json ./packages/sdk/package.json

COPY packages/db/package.json ./packages/db/package.json

COPY packages/shared/package.json ./packages/shared/package.json

RUN npm i

COPY packages/db ./packages/db

COPY packages/shared ./packages/shared

COPY packages/sdk ./packages/sdk

COPY apps/frontend ./apps/frontend

COPY apps/backend ./apps/backend

RUN npm run build --workspace=db

RUN npm run build --workspace=shared

RUN npm run build --workspace=sdk

RUN npm run build --workspace=frontend

FROM base AS main

WORKDIR /app

COPY --from=build /app/apps/frontend/.next/standalone ./

EXPOSE 3000

CMD [ "node", "./apps/frontend/server.js" ]

