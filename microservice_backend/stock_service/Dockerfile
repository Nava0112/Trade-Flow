FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm ci

WORKDIR /app
COPY stock_service ./stock_service
WORKDIR /app/stock_service
RUN npm ci

EXPOSE 2006
CMD ["npm", "start"]
