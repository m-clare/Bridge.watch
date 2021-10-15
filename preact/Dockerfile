FROM node:16-stretch-slim

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install
RUN npm install -g nodemon
COPY . .