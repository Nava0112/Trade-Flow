FROM node:18-alpine

WORKDIR /app

# Copy shared module
COPY shared ./shared
# Install shared dependencies
WORKDIR /app/shared
RUN npm install

# Copy service
WORKDIR /app
COPY api_gateway ./api_gateway

# Install service dependencies (which include local shared pkg)
WORKDIR /app/api_gateway
RUN npm install

EXPOSE 3000
CMD ["npm", "start"]