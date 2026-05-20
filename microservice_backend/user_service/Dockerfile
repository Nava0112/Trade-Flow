FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm ci

WORKDIR /app
COPY user_service ./user_service
WORKDIR /app/user_service
RUN npm ci

EXPOSE 2007
CMD ["npm", "start"]
