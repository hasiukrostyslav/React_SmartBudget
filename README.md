# Smart Budget

A full-stack personal finance application to help you take control of your money. Track income, expenses, and savings — all in one place.

## Features

- Track income and expenses by category
- Dashboard with charts and analytics
- Set and manage budgets and savings goals
- Secure cookie-based authentication with JWT
- Automatic token refresh — sessions stay alive seamlessly
- CSRF protection on all mutating requests
- Light / dark theme support
- Forgot password flow

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, React Router 7, TanStack Query 5, React Hook Form, Zod |
| Styling | TailwindCSS 4, Motion, Lucide React, React Toastify |
| NestJS API | NestJS 11, @nestjs/jwt, Zod, bcrypt, csrf-csrf, Helmet, pg |
| Express API | Express 5, jsonwebtoken, Zod, bcrypt, csrf-csrf, Helmet, pg |
| Database | PostgreSQL |
| Build | Vite 7 (client), tsc (servers) |

## Project Structure

```
react_smart_budget/
├── client/           # React SPA (Vite)
├── server/           # NestJS API — primary backend (port 3001)
└── express-server/   # Express API — alternative backend (port 3002)
```

Both backends expose the same REST API. The client switches between them via a single environment variable.

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 15+

### 1. Clone the repository

```bash
git clone https://github.com/hasiukrostyslav/React_SmartBudget.git
cd React_SmartBudget
```

### 2. Database

Create a PostgreSQL database and run the schema migrations. Both servers connect via `DATABASE_URL`.

### 3. Client

```bash
cd client
npm install
cp .env.example .env   # fill in the values
npm run dev            # http://localhost:5173
```

#### Client environment variables

```env
VITE_API_SERVER=express          # 'express' | 'nest'
VITE_API_NEST_URL=http://localhost:3001
VITE_API_EXPRESS_URL=http://localhost:3002
```

#### Client scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview production build |
| `npm run lint` | ESLint check |
| `npm run format` | Prettier format |

### 4. NestJS server

```bash
cd server
npm install
cp .env.example .env   # fill in the values
npm run start:dev      # http://localhost:3001
```

#### NestJS environment variables

```env
NODE_ENV=development
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/smart_budget

JWT_ACCESS_SECRET=<long-random-hex>
JWT_REFRESH_SECRET=<long-random-hex>
CSRF_SECRET=<long-random-hex>

CLIENT_URL=https://your-frontend.vercel.app
```

#### NestJS scripts

| Script | Description |
|---|---|
| `npm run start:dev` | Watch mode |
| `npm run start:prod` | Run compiled build |
| `npm run build` | Compile TypeScript |
| `npm run test` | Jest unit tests |
| `npm run test:e2e` | End-to-end tests |

### 5. Express server

```bash
cd express-server
npm install
cp .env.example .env   # fill in the values
npm run dev            # http://localhost:3002
```

#### Express environment variables

```env
NODE_ENV=development
PORT=3002
DATABASE_URL=postgresql://user:password@localhost:5432/smart_budget

JWT_ACCESS_SECRET=<long-random-hex>
JWT_REFRESH_SECRET=<long-random-hex>
CSRF_SECRET=<long-random-hex>

CLIENT_URL=https://your-frontend.vercel.app
```

#### Express scripts

| Script | Description |
|---|---|
| `npm run dev` | ts-node-dev watch mode |
| `npm run build` | Compile TypeScript |
| `npm run start` | Run compiled build |

## API Reference

Both backends expose identical routes.

### Auth — `/api/auth`

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/csrf-token` | — | Fetch a CSRF token before any mutating request |
| `POST` | `/login` | — | Sign in; sets `access_token` + `refresh_token` cookies |
| `POST` | `/signup` | — | Register; sets `access_token` + `refresh_token` cookies |
| `POST` | `/refresh` | — | Rotate access token using the refresh token cookie |
| `POST` | `/signout` | — | Clear all auth cookies |
| `GET` | `/session` | JWT | Return the authenticated user's profile and token expiry |

### Dashboard — `/api/dashboard`

| Method | Route | Auth | Description |
|---|---|---|---|
| `GET` | `/` | JWT | Protected dashboard data |

## Authentication Flow

```
Client                          Server
  │                               │
  ├─ GET /api/auth/csrf-token ───►│  Receive CSRF token (stored in cookie + returned in body)
  │                               │
  ├─ POST /api/auth/login ───────►│  Validate credentials
  │  (X-CSRF-Token header)        │  Sign access token (15 min) + refresh token (7 days)
  │◄─ Set-Cookie: access_token ───┤  Both tokens set as HttpOnly cookies
  │◄─ Set-Cookie: refresh_token ──┤
  │                               │
  ├─ GET /api/auth/session ──────►│  Verify access_token cookie
  │◄─ { isAuthenticated, user } ──┤
  │                               │
  │  (access token expires)       │
  ├─ POST /api/auth/refresh ─────►│  Verify refresh_token cookie
  │◄─ Set-Cookie: access_token ───┤  Issue new access token
```

**Security details:**
- `access_token` — HttpOnly, 15-minute expiry, path `/`
- `refresh_token` — HttpOnly, 7-day expiry, scoped to `path: /api/auth/refresh`
- CSRF — double-submit cookie pattern via `csrf-csrf`; `sameSite: lax` in dev, `sameSite: none; Secure` in production
- Passwords hashed with bcrypt (10 rounds)

## Client Architecture

```
client/src/
├── pages/
│   ├── auth/             # LoginPage, SignUpPage, ForgotPasswordPage
│   └── dashboard/        # DashboardPage, TransactionPage, PaymentsPage,
│                         # CardsPage, SavingsPage, LoansPage,
│                         # DepositsPage, ProfilePage, SettingsPage
├── components/
│   ├── forms/            # Auth and app forms
│   ├── layouts/          # Header, Sidebar, Navbar, Footer
│   ├── routes/           # ProtectedRoute, RedirectRoute
│   └── ui/               # Shared UI primitives
├── hooks/                # useAuth, useLogin, useSignUp, useSignOut, useTheme
├── services/             # Axios instance + apiAuth functions
├── context/              # ThemeContext / ThemeProvider
├── lib/                  # Zod schemas, constants, utils
└── types/                # Shared TypeScript types
```

**State management:** TanStack Query handles all server state (auth session, data fetching, cache invalidation). Theme state lives in React Context.

**HTTP:** A single Axios instance is configured with automatic 401 interception — on a failed request it transparently calls `/refresh` and retries once before redirecting to login.

## Server Architecture

### NestJS (`server/`)

```
src/
├── modules/
│   ├── auth/             # Controller, Service, Guard, Schemas
│   ├── users/            # Service, Module, Types
│   └── dashboard/        # Controller, Module
├── common/
│   ├── pipes/            # ZodValidationPipe
│   └── constants/        # saltRounds
├── db/                   # Global PG pool module
├── types/                # RefreshTokenPayload, Express augmentation
├── app.module.ts
└── main.ts               # Helmet, CORS, CSRF bootstrap
```

### Express (`express-server/`)

```
src/
├── modules/
│   ├── auth/             # Router, Controller, Service, Schemas
│   ├── users/            # Service, Types
│   └── dashboard/        # Router, Controller
├── middleware/
│   ├── auth.middleware.ts     # JWT guard (replaces NestJS AuthGuard)
│   ├── csrf.middleware.ts     # doubleCsrf setup
│   └── validate.middleware.ts # Zod validation factory
├── config/               # Cookie options, salt rounds
├── db/                   # pg Pool + query helper
├── types/                # RefreshTokenPayload, Express augmentation
├── app.ts                # Express app setup
└── server.ts             # Entry point
```

## Author

[Rostyslav Hasiuk](https://github.com/hasiukrostyslav)
