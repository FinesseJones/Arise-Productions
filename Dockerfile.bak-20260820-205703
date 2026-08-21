# Multi-stage Dockerfile for Unified 3D Production Studio (Brand First App)

# 1. Build Stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy root and workspace package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm ci || npm install

# Copy source files
COPY . .

# Build the frontend production bundle
RUN cd frontend && npm run build

# 2. Production Stage (NGINX)
FROM nginx:alpine

# Copy built frontend assets to NGINX web root
COPY --from=builder /app/frontend/dist /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Run NGINX in foreground
CMD ["nginx", "-g", "daemon off;"]
