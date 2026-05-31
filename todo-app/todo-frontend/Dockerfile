FROM node:22 AS build-stage

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

ENV VITE_BACKEND_URL=http://localhost/api

RUN npm run build



FROM nginx:1.29-alpine

COPY --from=build-stage /usr/src/app/dist /usr/share/nginx/html