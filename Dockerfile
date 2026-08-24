# ==============================================================================
# ARISE PRODUCTION STUDIO - PRODUCTION DOCKERFILE FOR VPS & CLOUD DEPLOYMENT
# THE AI CONTENT FOUNDRY, LLC • © 2026 • ALL RIGHTS RESERVED
# ==============================================================================

# Stage 1: Build Frontend SPA
FROM node:20-alpine AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN npm install
RUN npm install --prefix frontend

# Copy frontend source code & build
COPY frontend ./frontend
RUN npm run build --prefix frontend

# Stage 2: Production Runtime
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=4000

# Install production dependencies
COPY package*.json ./
RUN npm install --omit=dev

# Copy backend server and services
COPY server.js ./
COPY backend ./backend

# Copy compiled frontend from builder stage
COPY --from=builder /app/frontend/dist ./frontend/dist

# Expose HTTP & WebSocket port
EXPOSE 4000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:4000/api/v1/projects || exit 1

# Launch Arise Production Unified Studio Server
CMD ["node", "server.js"]
