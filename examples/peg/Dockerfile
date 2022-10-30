FROM node:19.0.0-alpine

WORKDIR /app

COPY ./examples/peg/ ./

RUN npm install

CMD ["npm", "run", "start"]