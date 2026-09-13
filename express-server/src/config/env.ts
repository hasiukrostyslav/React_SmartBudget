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
  // auto: honour ?sslmode= in the URL; otherwise off for a local host and on
  // for anything remote. The explicit values exist for hosts the heuristic
  // can't know about — a Docker Compose service name, a private network.
  DATABASE_SSL: z.enum(['auto', 'require', 'disable']).default('auto'),
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

if (!parsed.success) {
  const issues = parsed.error.issues
    .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
    .join('\n');
  // Thrown rather than process.exit(): at boot an uncaught throw still exits 1
  // with this message, and under test the runner reports it as a normal
  // failure instead of dying before the first test.
  throw new Error(`Invalid environment configuration:\n${issues}`);
}

export const env = parsed.data;

export const isProd = env.NODE_ENV === 'production';

const LOCAL_HOSTS = new Set([
  'localhost',
  '127.0.0.1',
  '[::1]',
  'host.docker.internal',
]);

function resolveDatabaseSsl(): false | { rejectUnauthorized: true } {
  if (env.DATABASE_SSL === 'require') return { rejectUnauthorized: true };
  if (env.DATABASE_SSL === 'disable') return false;

  let url: URL;
  try {
    url = new URL(env.DATABASE_URL);
  } catch {
    // Unparseable: fail toward the safe side and let pg report the real issue.
    return { rejectUnauthorized: true };
  }

  const sslmode = url.searchParams.get('sslmode');
  if (sslmode === 'disable') return false;
  if (sslmode) return { rejectUnauthorized: true };

  return LOCAL_HOSTS.has(url.hostname) ? false : { rejectUnauthorized: true };
}

export const databaseSsl = resolveDatabaseSsl();
