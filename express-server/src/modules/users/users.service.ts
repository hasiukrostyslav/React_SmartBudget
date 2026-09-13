import { query } from '../../db/index';
import { NewUserDto } from '../auth/auth.schemas';
import { Users } from './users.types';

// These deliberately do NOT catch. A missing row is `null`; a failing query is
// an exception. Collapsing both into `null` made a database outage look like
// "Invalid email or password!" to the user, and let signup issue tokens for a
// user whose INSERT had failed.

export async function findUserByEmail(email: string): Promise<Users | null> {
  const result = await query<Users>('SELECT * FROM "users" WHERE email = $1;', [
    email,
  ]);
  return result.rows[0] ?? null;
}

export async function findUserById(id: string): Promise<Users | null> {
  const result = await query<Users>('SELECT * FROM "users" WHERE id = $1;', [
    id,
  ]);
  return result.rows[0] ?? null;
}

export async function createUser({
  id,
  email,
  hashedPassword,
  name,
}: NewUserDto): Promise<Users> {
  const result = await query<Users>(
    `INSERT INTO "users" (id, email, password, name) VALUES ($1, $2, $3, $4) RETURNING *;`,
    [id, email, hashedPassword, name],
  );
  return result.rows[0];
}
