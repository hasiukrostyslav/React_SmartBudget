import dotenv from 'dotenv';
dotenv.config();

// These must load AFTER dotenv: both read process.env at module-init time
// (CSRF_SECRET, NODE_ENV) and would capture undefined if hoisted above it.
import { doubleCsrfProtection } from './middleware/csrf.middleware';
import { errorHandler } from './middleware/error.middleware';
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { apiLimiter, authLimiter } from './middleware/rateLimit.middleware';
import authRouter from './modules/auth/auth.router';
import dashboardRouter from './modules/dashboard/dashboard.router';

const isProd = process.env.NODE_ENV === 'production';

export const app: Application = express();

// Rate limiting keys on req.ip. Behind a PaaS load balancer every request
// carries the proxy's address, so without this the whole user base shares one
// bucket. `1` = trust exactly one hop; `true` would let a client forge
// X-Forwarded-For and bypass the limiter entirely.
if (isProd) app.set('trust proxy', 1);

app.use(helmet());

app.use(
  cors({
    origin: ['http://localhost:5173', process.env.CLIENT_URL as string].filter(
      Boolean,
    ),
    credentials: true, // allow cookies on cross-origin requests from the SPA
  }),
);

// After cors so preflight OPTIONS requests don't consume anyone's budget.
app.use(apiLimiter);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply CSRF protection globally except for signout — which only clears cookies
// and therefore doesn't need a valid CSRF token.
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/auth/signout') return next();
  return doubleCsrfProtection(req, res, next);
});

// Credential endpoints get a much tighter budget than the rest of the API.
app.use('/api/auth/login', authLimiter);
app.use('/api/auth/signup', authLimiter);

app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);

// MUST stay last: Express selects the error handler by 4-arg arity, and only
// middleware registered after the routers can catch what they throw.
app.use(errorHandler);
