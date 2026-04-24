import dotenv from 'dotenv';
dotenv.config();

// csrf.middleware must load AFTER dotenv so CSRF_SECRET is available at init time
import { doubleCsrfProtection } from './middleware/csrf.middleware';
import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import authRouter from './modules/auth/auth.router';
import dashboardRouter from './modules/dashboard/dashboard.router';

export const app: Application = express();

app.use(helmet());

app.use(
  cors({
    origin: ['http://localhost:5173', process.env.CLIENT_URL as string].filter(Boolean),
    credentials: true, // allow cookies on cross-origin requests from the SPA
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Apply CSRF protection globally except for signout — which only clears cookies
// and therefore doesn't need a valid CSRF token (mirrors NestJS middleware exclusion).
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path === '/api/auth/signout') return next();
  return doubleCsrfProtection(req, res, next);
});

app.use('/api/auth', authRouter);
app.use('/api/dashboard', dashboardRouter);
