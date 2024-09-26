FROM node:lts-alpine3.20 as base

FROM base as build

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

FROM base as main

COPY --from=build /app /

EXPOSE 