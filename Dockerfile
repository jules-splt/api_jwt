FROM node:20

WORKDIR /app

COPY package*.json ./
run npm install

COPY . .

CMD [ "npm","run","dev" ]