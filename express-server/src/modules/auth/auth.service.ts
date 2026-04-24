import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { createId } from '@paralleldrive/cuid2';
import { SALT_ROUNDS } from '../../config/constants';
import { SignInDto, SignUpDto } from './auth.schemas';
import { findUserByEmail, findUserById, createUser } from '../users/users.service';
import { Users } from '../users/users.types';
import { RefreshTokenPayload } from '../../types/types';

interface JwtPayload {
  sub: string;
  email: string;
}

interface Tokens {
  access_token: string;
  refresh_token: string;
}

interface ServiceError {
  status: number;
  message: string;
}

function serviceError(status: number, message: string): ServiceError {
  return { status, message };
}

export function signTokens(userId: string, email: string): Tokens {
  const payload: JwtPayload = { sub: userId, email };

  const access_token = jwt.sign(payload, process.env.JWT_ACCESS_SECRET as string, {
    expiresIn: '15m',
  });

  const refresh_token = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
    expiresIn: '7d',
  });

  return { access_token, refresh_token };
}

export async function login(dto: SignInDto): Promise<{ tokens: Tokens; user: Users }> {
  const user = await findUserByEmail(dto.email);

  if (!user) throw serviceError(401, 'Invalid email or password!');

  const passwordMatches = await bcrypt.compare(dto.password, user.password);

  if (!passwordMatches) throw serviceError(401, 'Invalid email or password!');

  return { tokens: signTokens(user.id, user.email), user };
}

export async function signup(dto: SignUpDto): Promise<{ tokens: Tokens; user: Users }> {
  const existing = await findUserByEmail(dto.email);

  if (existing) throw serviceError(401, 'An account with this email already exists.');

  const hashedPassword = await bcrypt.hash(dto.password, SALT_ROUNDS);

  await createUser({
    id: createId(),
    name: dto.name,
    email: dto.email,
    hashedPassword,
  });

  // Delegate to login so the same token-generation path is always used
  return login({ email: dto.email, password: dto.password });
}

export async function refreshAccessToken(refreshToken: string): Promise<string> {
  try {
    const payload = jwt.verify(
      refreshToken,
      process.env.JWT_REFRESH_SECRET as string,
    ) as RefreshTokenPayload;

    // Look up by email to match the original server behaviour
    const user = await findUserByEmail(payload.email);

    if (!user) throw new Error();

    return jwt.sign(
      { sub: payload.sub, email: payload.email },
      process.env.JWT_ACCESS_SECRET as string,
      { expiresIn: '15m' },
    );
  } catch {
    throw serviceError(401, 'Invalid or expired refresh token');
  }
}
