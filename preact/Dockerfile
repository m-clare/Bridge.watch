FROM node:16-stretch-slim

WORKDIR /usr/src/app

COPY ./package*.json ./
RUN npm install
COPY . .