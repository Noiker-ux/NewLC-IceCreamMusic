FROM node:lts-alpine3.20

WORKDIR /app

COPY . .

RUN npm install

RUN npm run build

RUN rm -rf /app/node_modules

RUN npm ci

CMD [ "npm", "run", "start" ]

