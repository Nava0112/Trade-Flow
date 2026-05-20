FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm ci

WORKDIR /app
COPY api_gateway ./api_gateway
WORKDIR /app/api_gateway
RUN npm ci

EXPOSE 2001
CMD ["npm", "start"]
