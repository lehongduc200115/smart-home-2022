FROM node:12.19.1-alpine3.12

# ARG NODE_ENV
# ENV NODE_ENV=$NODE_ENV

WORKDIR /app

# COPY ./start.sh /app/start.sh
# RUN chmod +x /app/start.sh

COPY ./dist ./dist
COPY ./package.json ./package.json
COPY ./package-lock.json ./package-lock.json
COPY ./.npmrc ./.npmrc
RUN npm i --production

EXPOSE 8080

CMD [ "node", "/app/dist/src/server.js"]