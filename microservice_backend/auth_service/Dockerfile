FROM node:18-alpine

WORKDIR /app

# Copy shared module
COPY shared ./shared
# Install shared dependencies
WORKDIR /app/shared
RUN npm install

# Copy service
WORKDIR /app
COPY auth_service ./auth_service

# Install service dependencies
WORKDIR /app/auth_service
RUN npm install

EXPOSE 2002
CMD ["npm", "start"]