FROM node:14.9.0-alpine

WORKDIR /app
COPY . /app

RUN apk update && apk add --no-cache docker-cli

RUN yarn

CMD ["node", "index.js"]