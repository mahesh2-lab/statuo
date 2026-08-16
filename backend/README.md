# ⚙️ Statuo Backend & Distributed Engine

High-performance API server, telemetry collector, and distributed scheduling engine for **Statuo (Pulse)**.

## 🚀 Tech Stack

- **Runtime & Framework**: [Node.js](https://nodejs.org/) + [Express 5](https://expressjs.com/) + [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: [PostgreSQL 16](https://www.postgresql.org/) + [Drizzle ORM](https://orm.drizzle.team/)
- **Caching & Queues**: [Redis 7](https://redis.io/) + [ioredis](https://github.com/redis/ioredis)
- **Authentication**: [Better Auth](https://www.better-auth.com/) (`better-auth`, `@better-auth/drizzle-adapter`, `@better-auth/infra`)
- **Scheduler**: `node-cron` with push scheduling and 30-second polling fallback
- **Security**: AES-256-GCM secret encryption, rate-limiting middleware, CORS policies

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Configuration
Ensure your `.env` is configured with valid database and Redis connections:
```env
PORT=3000
DATABASE_URL=postgresql://statuo_user:password@localhost:5432/statuo_db
REDIS_URL=redis://localhost:6379
BETTER_AUTH_SECRET=your_better_auth_secret_key_32_chars_min
BETTER_AUTH_URL=http://localhost:3000
CORS_ORIGIN=http://localhost:5173
```

### 3. Database Migration
Push your schema definitions to PostgreSQL using Drizzle Kit:
```bash
pnpm drizzle-kit push
```

### 4. Run Development Server
```bash
pnpm dev
```
The API server will listen on [http://localhost:3000](http://localhost:3000).

---

## 📡 API Endpoints Summary

- **Authentication**: `/api/auth/*` (Better Auth handlers)
- **Job CRUD & Metrics**: `/api/v1/jobs`
- **Instant Test Probes**: `POST /api/v1/jobs/:id/trigger`
- **Fleet Analytics**: `GET /api/v1/analytics`
- **Health Check**: `GET /health`
