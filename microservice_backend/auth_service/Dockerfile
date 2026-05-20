FROM node:18-alpine

WORKDIR /app

COPY shared ./shared
WORKDIR /app/shared
RUN npm ci

WORKDIR /app
COPY auth_service ./auth_service
WORKDIR /app/auth_service
RUN npm ci

EXPOSE 2002
CMD ["npm", "start"]
