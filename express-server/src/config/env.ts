import dotenv from 'dotenv';
import { z } from 'zod';

// Loaded here, at the single module every other file reads configuration from.
// That removes the import-order hazard app.ts used to carry: anything that
// needs env imports `env`, which guarantees dotenv has already run.
dotenv.config();

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  PORT: z.coerce.number().int().positive().default(3002),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  // 32 hex chars is the floor for an HMAC secret worth having.
  JWT_ACCESS_SECRET: z
    .string()
    .min(32, 'JWT_ACCESS_SECRET must be >= 32 chars'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be >= 32 chars'),
  CSRF_SECRET: z.string().min(32, 'CSRF_SECRET must be >= 32 chars'),
  CLIENT_URL: z.url('CLIENT_URL must be a valid URL').optional(),
});

const parsed = EnvSchema.safeParse(process.env);

// Fail at boot with the variable name, rather than at request time with an
// undefined secret that produces HMACs which silently never verify.
if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  console.error(`Invalid environment configuration:\n${issues}`);
  process.exit(1);
}

export const env = parsed.data;

export const isProd = env.NODE_ENV === 'production';

// Local Postgres generally has no TLS; anything remote must present a
// verifiable certificate. Previously hardcoded on, which made a local DB
// unusable without editing source.
const isLocalDatabase = /@(localhost|127\.0\.0\.1)[:/]/.test(env.DATABASE_URL);

export const databaseSsl = isLocalDatabase
  ? false
  : { rejectUnauthorized: true };
