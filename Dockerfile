FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install typescript

COPY . .

CMD ["npm", "start"]