FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm ci

WORKDIR /app
COPY order_service ./order_service
WORKDIR /app/order_service
RUN npm ci

EXPOSE 2004
CMD ["npm", "start"]
