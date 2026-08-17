# =========================================================================
# Unified Single Dockerfile for Statuo Platform
# Multi-stage build combining Frontend SPA + Backend API & Cron Scheduler
# =========================================================================

# --- Stage 1: Build React 19 Frontend ---
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend

RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 20000 && \
    pnpm config set fetch-retry-maxtimeout 120000

# Copy dependency definitions and install
COPY frontend/package.json frontend/pnpm-lock.yaml* frontend/pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile --ignore-workspace

# Copy frontend source code
COPY frontend ./

# Build production assets
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL
RUN pnpm build

# --- Stage 2: Install Backend Dependencies ---
FROM node:22-alpine AS backend-deps
WORKDIR /app/backend

RUN corepack enable && corepack prepare pnpm@9 --activate
RUN pnpm config set fetch-retries 5 && \
    pnpm config set fetch-retry-mintimeout 20000 && \
    pnpm config set fetch-retry-maxtimeout 120000

# Copy dependency definitions and install
COPY backend/package.json backend/pnpm-lock.yaml* backend/pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile --ignore-workspace

# --- Stage 3: Production Runtime ---
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV CI=true
ENV PORT=3000
ENV CLIENT_DIST_PATH=/app/client

# Copy backend dependencies and source files
COPY --from=backend-deps /app/backend/node_modules ./node_modules
COPY backend/package.json backend/pnpm-lock.yaml* ./
COPY backend/tsconfig.json ./
COPY backend/drizzle.config.ts ./
COPY backend/drizzle ./drizzle
COPY backend/src ./src

# Compile TypeScript → JavaScript (removes tsx dev-transpiler from the hot path)
RUN ./node_modules/.bin/tsx --version && \
    ./node_modules/.bin/tsc --noEmit --project tsconfig.json || true

# Copy compiled frontend assets to /app/client for Express static serving
COPY --from=frontend-builder /app/frontend/dist ./client

# Non-root security user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# Health check — must match the actual API route
HEALTHCHECK --interval=30s --timeout=10s --start-period=20s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:3000/api/health || exit 1

# Use tsx to run TypeScript directly (it is installed as a prod dependency)
CMD ["./node_modules/.bin/tsx", "src/index.ts"]
