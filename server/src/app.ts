import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Application } from 'express';
import helmet from 'helmet';

// config/env loads dotenv itself, so no import here is order-sensitive.
import { env, isProd } from './config/env';
import { query } from './db/index';
import { doubleCsrfProtection } from './middleware/csrf.middleware';
import { errorHandler } from './middleware/error.middleware';
import { httpLogger } from './middleware/httpLogger.middleware';
import { notFoundHandler } from './middleware/notFound.middleware';
import {
  apiLimiter,
  authLimiter,
  healthLimiter,
} from './middleware/rateLimit.middleware';
import authRouter from './modules/auth/auth.router';
import dashboardRouter from './modules/dashboard/dashboard.router';
import transactionsRouter from './modules/transactions/transactions.router';

export const app: Application = express();

// Rate limiting keys on req.ip. Behind a PaaS load balancer every request
// carries the proxy's address, so without this the whole user base shares one
// bucket. `1` = trust exactly one hop; `true` would let a client forge
// X-Forwarded-For and bypass the limiter entirely.
if (isProd) app.set('trust proxy', 1);

app.use(httpLogger);
app.use(helmet());

// The Vite dev origin is only meaningful outside production; leaving it in the
// production allowlist would let a page on a user's own localhost make
// credentialed requests to the live API.
const allowedOrigins = [
  ...(isProd ? [] : ['http://localhost:5173']),
  ...(env.CLIENT_URL ? [env.CLIENT_URL] : []),
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // allow cookies on cross-origin requests from the SPA
  }),
);

// Liveness for orchestrators and uptime monitors. Before the API limiter and
// CSRF so a probe is never rejected for lacking a token, but behind its own
// limiter because it does a real database round-trip on a public path.
app.get('/health', healthLimiter, async (_req, res) => {
  await query('SELECT 1;');
  res.json({ status: 'ok' });
});

// After cors so preflight OPTIONS requests don't consume anyone's budget.
app.use(apiLimiter);

// JSON only — nothing posts a form, and urlencoded parsing would turn numeric
// fields into strings the zod schemas then reject.
app.use(express.json());
app.use(cookieParser());

// Exemptions live in the csrf config (skipCsrfProtection), not here.
app.use(doubleCsrfProtection);

// Credential endpoints get a much tighter budget than the rest of the API.
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
app.use('/api/transactions', transactionsRouter);

// Order matters from here down: unmatched routes become a 404 AppError, and
// the error handler must be last — Express selects it by 4-arg arity, and it
// can only catch what was registered before it.
app.use(notFoundHandler);
app.use(errorHandler);
