FROM node:19.0.0-alpine

WORKDIR /app

COPY ./examples/indirect/src ./src

COPY ./examples/indirect/package.json .

RUN npm install


CMD ["npm", "run", "start"]
