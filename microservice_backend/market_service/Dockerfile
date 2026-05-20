FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm ci

WORKDIR /app
COPY market_service ./market_service
WORKDIR /app/market_service
RUN npm ci

EXPOSE 2003
CMD ["npm", "start"]
