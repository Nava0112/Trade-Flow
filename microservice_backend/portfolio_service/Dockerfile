FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm ci

WORKDIR /app
COPY portfolio_service ./portfolio_service
WORKDIR /app/portfolio_service
RUN npm ci

EXPOSE 2005
CMD ["npm", "start"]
