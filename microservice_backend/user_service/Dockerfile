FROM node:18-alpine

WORKDIR /app

# Copy shared module
COPY shared ./shared
# Install shared dependencies
WORKDIR /app/shared
RUN npm install

# Copy service
WORKDIR /app
COPY user_service ./user_service

# Install service dependencies
WORKDIR /app/user_service
RUN npm install

EXPOSE 2007
CMD ["npm", "start"]