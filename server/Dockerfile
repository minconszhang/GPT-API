# Build stage
FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy source code and build NestJS
COPY . .
RUN npm run build

# Production run stage
FROM node:18-alpine
WORKDIR /app
ENV NODE_ENV=production

# Copy build artifacts and dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Expose port
EXPOSE 3888

# Start command
CMD ["npm", "run", "start:prod"]
