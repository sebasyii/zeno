FROM node:19.0.0-alpine

WORKDIR /app

COPY ./examples/peg/ ./

COPY ./ /opt/zeno

RUN npm install

# Install the Zeno middleware
RUN npm install /opt/zeno

CMD ["npm", "run", "start"]