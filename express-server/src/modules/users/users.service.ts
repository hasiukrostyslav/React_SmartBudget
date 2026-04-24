import { query } from '../../db/index';
import { NewUserDto } from '../auth/auth.schemas';
import { Users } from './users.types';

export async function findUserByEmail(email: string): Promise<Users | null> {
  try {
    const result = await query('SELECT * FROM "users" WHERE email = $1;', [email]);
    return result.rows[0] || null;
  } catch (error: unknown) {
    if (error instanceof Error) console.error('DB error:', error.message);
    return null;
  }
}

export async function findUserById(id: string): Promise<Users | null> {
  try {
    const result = await query('SELECT * FROM "users" WHERE id = $1;', [id]);
    return result.rows[0] || null;
  } catch (error: unknown) {
    if (error instanceof Error) console.error('DB error:', error.message);
    return null;
  }
}

export async function createUser({ id, email, hashedPassword, name }: NewUserDto): Promise<Users | null> {
  try {
    const result = await query(
      `INSERT INTO "users" (id, email, password, name) VALUES ($1, $2, $3, $4) RETURNING *;`,
      [id, email, hashedPassword, name],
    );
    return result.rows[0];
  } catch (error: unknown) {
    if (error instanceof Error) console.error('DB error:', error.message);
    return null;
  }
}
