FROM node:19.0.0-alpine

WORKDIR /app

COPY ./examples/idor/src ./src

COPY ./examples/idor/package.json .

COPY ./ /opt/zeno

RUN npm install

# Install the Zeno middleware
RUN npm install /opt/zeno

CMD ["npm", "run", "start"]
