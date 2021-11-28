FROM node:16

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

RUN  export MONGO_URL='${{ secrets.MONGO_URL}}'

COPY . .

EXPOSE 8080

CMD [ "node", "server.js" ]