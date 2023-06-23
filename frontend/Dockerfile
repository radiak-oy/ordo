FROM node:lts-alpine AS builder
WORKDIR /app

COPY ["package.json", "package-lock.json", "./"]
RUN npm install

FROM builder AS generator

COPY . .
RUN npm run build

FROM nginx:stable-alpine

RUN mkdir -p /data/nginx/cache
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

WORKDIR /usr/share/nginx/html

COPY --from=generator /app/dist/ ./

VOLUME /etc/nginx/conf.d
