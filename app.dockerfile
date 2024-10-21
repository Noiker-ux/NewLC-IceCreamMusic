FROM node:lts-alpine3.20 AS base

FROM base AS build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build:app

FROM base AS main

COPY --from=build /app/.next/standalone ./

COPY --from=build /app/.next/static ./.next/static

COPY --from=build /app/public ./public

ENV PORT 3000

ENV HOSTNAME localhost

EXPOSE 3000

CMD [ "node", "server.js" ]

