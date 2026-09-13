import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createId } from '@paralleldrive/cuid2';

import { env } from '../../config/env';
import {
  ACCESS_TOKEN_TTL_SECONDS,
  REFRESH_TOKEN_TTL_SECONDS,
} from '../../config/tokens';
import { AppError } from '../../lib/AppError';
import { createUser, findUserByEmail } from '../users/users.service';
import { Users } from '../users/users.types';
import { SignInDto, SignUpDto } from './auth.schemas';
import { JwtPayload, RefreshTokenPayload, Tokens } from './auth.types';

// bcrypt cost factor. Lives with the only code that hashes.
const SALT_ROUNDS = 10;

// Compared against when the email is unknown — or the account has no password
// at all, as OAuth-created users from the Next app don't — so every login
// costs exactly one bcrypt.compare. Without it the not-found path returned
// ~57 ms faster than a real compare: a timing oracle for which emails exist.
const DUMMY_PASSWORD_HASH = bcrypt.hashSync('timing-equalizer', SALT_ROUNDS);

const INVALID_CREDENTIALS = 'Invalid email or password!';
const INVALID_REFRESH = 'Invalid or expired refresh token';

export function signTokens(userId: string, email: string): Tokens {
  const payload: JwtPayload = { sub: userId, email };

  const access_token = jwt.sign(payload, env.JWT_ACCESS_SECRET, {
    expiresIn: ACCESS_TOKEN_TTL_SECONDS,
  });

  // jti makes every refresh token unique even when two are minted in the same
  // second, and is the handle a future revocation table would key on.
  const refresh_token = jwt.sign(
    { ...payload, jti: createId() },
    env.JWT_REFRESH_SECRET,
    { expiresIn: REFRESH_TOKEN_TTL_SECONDS },
  );

  return { access_token, refresh_token };
}

export async function login(
  dto: SignInDto,
): Promise<{ tokens: Tokens; user: Users }> {
  const user = await findUserByEmail(dto.email);

  // Always compare, never short-circuit — see DUMMY_PASSWORD_HASH.
  const passwordMatches = await bcrypt.compare(
    dto.password,
    user?.password ?? DUMMY_PASSWORD_HASH,
  );

  if (!user || !passwordMatches) throw new AppError(401, INVALID_CREDENTIALS);

  return { tokens: signTokens(user.id, user.email), user };
}

export async function signup(
  dto: SignUpDto,
): Promise<{ tokens: Tokens; user: Users }> {
  const existing = await findUserByEmail(dto.email);

  if (existing)
    throw new AppError(409, 'An account with this email already exists.');

  const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

  const user = await createUser({
    id: createId(),
    name: dto.name,
    email: dto.email,
    hashedPassword,
  });

  // Same token path as login, without re-fetching the row and re-hashing the
  // password that was hashed a moment ago.
  return { tokens: signTokens(user.id, user.email), user };
}

// Rotates: every refresh issues a NEW refresh token alongside the access token,
// so the client always holds the latest one and an active session slides
// forward instead of hard-expiring after seven days.
//
// The previous refresh token stays valid until its own expiry. Revoking it on
// reuse — the part that actually defeats a stolen cookie — needs a server-side
// token table keyed on jti, which is a schema change and is not done here.
export async function refreshTokens(refreshToken: string): Promise<Tokens> {
  let payload: RefreshTokenPayload;

  try {
    payload = jwt.verify(
      refreshToken,
      env.JWT_REFRESH_SECRET,
    ) as RefreshTokenPayload;
  } catch {
    // Only a bad/expired signature lands here. Anything below is infrastructure
    // and must surface as a 500 so the outage is visible in the logs.
    throw new AppError(401, INVALID_REFRESH);
  }

  // Look up by email to match the original server behaviour
  const user = await findUserByEmail(payload.email);

  if (!user) throw new AppError(401, INVALID_REFRESH);

  return signTokens(user.id, user.email);
}
