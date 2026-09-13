import rateLimit from 'express-rate-limit';

const ONE_MINUTE = 60 * 1000;
const FIFTEEN_MINUTES = 15 * ONE_MINUTE;

// NOTE: the default memory store counts per process. Behind more than one
// instance each gets its own budget — swap in a shared store (Redis) if this
// ever scales horizontally.

// Credential endpoints. Tight, because bcrypt at 10 rounds makes each attempt
// expensive for us as well as slow for an attacker.
// skipSuccessfulRequests keeps the budget for FAILED attempts only, so a user
// who signs in and out repeatedly is never locked out of their own account.
export const authLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 10,
  skipSuccessfulRequests: true,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many attempts. Please try again in 15 minutes.',
  },
});

// Everything else. Loose enough that normal dashboard use never notices, low
// enough to blunt a scripted flood.
export const apiLimiter = rateLimit({
  windowMs: FIFTEEN_MINUTES,
  limit: 500,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many requests. Please slow down.',
  },
});

// The health probe is public and does a real database round-trip. Generous
// enough for any orchestrator's cadence, bounded so it can't be used to
// exhaust the connection pool.
export const healthLimiter = rateLimit({
  windowMs: ONE_MINUTE,
  limit: 60,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: 'Too many health checks.',
  },
});
