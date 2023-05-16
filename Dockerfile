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

ARG NEXT_PUBLIC_APP_NAME
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_NAME=$NEXT_PUBLIC_APP_NAME
ENV NEXT_PUBLIC_APP_URL=$NEXT_PUBLIC_APP_URL

RUN npm run build
