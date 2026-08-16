# --- Stage 1: Build Frontend Assets ---
FROM node:22-alpine AS builder
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

COPY . .

# Optional Build Argument for external API URL (defaults to empty string for relative proxy via Nginx)
ARG VITE_API_URL=""
ENV VITE_API_URL=$VITE_API_URL

RUN pnpm build

# --- Stage 2: Serve with Nginx ---
FROM nginx:alpine AS runner

# Remove default nginx static assets
RUN rm -rf /usr/share/nginx/html/*

# Copy built static bundle from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

# Health check against Nginx web server
HEALTHCHECK --interval=10s --timeout=5s --start-period=5s --retries=3 \
  CMD wget -q -O - http://127.0.0.1:80/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
