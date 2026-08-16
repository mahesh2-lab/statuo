# 🖥️ Statuo Frontend

Modern, high-density observability dashboard and landing client for **Statuo (Pulse)**.

## 🚀 Tech Stack

- **Framework**: [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components & UI**: [Radix UI](https://www.radix-ui.com/), [Lucide React](https://lucide.dev/), [Huge Icons](https://hugeicons.com/)
- **Animations**: [Motion (Framer Motion)](https://motion.dev/)
- **Data & State**: [TanStack Query v5](https://tanstack.com/query/latest), [Axios](https://axios-http.com/), [React Hook Form](https://react-hook-form.com/) + [Zod](https://zod.dev/)
- **Charts & Visualizations**: [Recharts](https://recharts.org/)
- **Authentication**: [Better Auth Client](https://www.better-auth.com/)

---

## 🎨 Design System

Statuo Frontend implements a tokenized, monolithic, content-first dark UI design with:
- **0px border-radius** (`rounded-none`) across all cards, modals, inputs, and buttons
- **Geist typography stack** configured at a high-density 12px base size
- Strict WCAG 2.2 AA contrast compliance
- See [`design.md`](./design.md) for full design system tokens and guidelines.

---

## 🛠️ Getting Started

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Environment Configuration
Ensure your `.env` is configured:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Development Server
```bash
pnpm dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Production Build & Linting
```bash
pnpm build        # Typecheck and build production bundle into dist/
pnpm lint         # Run ESLint
pnpm format       # Format code with Prettier
pnpm typecheck    # Validate TypeScript types without emit
```
