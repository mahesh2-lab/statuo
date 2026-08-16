# --- Base Stage ---
FROM node:22-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@latest --activate

# --- Dependencies Stage ---
FROM base AS deps
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# --- Production Runner Stage ---
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# Copy node_modules and project source files
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY tsconfig.json ./
COPY drizzle.config.ts ./
COPY drizzle ./drizzle
COPY src ./src

# Create a non-privileged user and adjust permissions
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs && \
    chown -R nodejs:nodejs /app

USER nodejs

EXPOSE 3000

# Health check against Pulse API health endpoint
HEALTHCHECK --interval=10s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:3000/health || exit 1

# Start the application using tsx runtime
CMD ["pnpm", "start"]
