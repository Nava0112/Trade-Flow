FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm ci

WORKDIR /app
COPY wallet_service ./wallet_service
WORKDIR /app/wallet_service
RUN npm ci

EXPOSE 2008
CMD ["npm", "start"]
