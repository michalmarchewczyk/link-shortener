FROM node:18-alpine as base

WORKDIR /app

COPY package*.json ./

RUN npm install



FROM base as dev

ENV NODE_ENV=development

COPY . .


FROM base as prod

ENV NODE_ENV=production

COPY . .

RUN npm run build
