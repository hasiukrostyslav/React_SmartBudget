import { Inject, Injectable } from '@nestjs/common';
import { Pool, QueryResult } from 'pg';
import type { Users } from './users.type';
import { NewUserDto } from '../auth/schemas/auth.schemas';

@Injectable()
export class UsersService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async findUserById(id: string): Promise<Users | null> {
    try {
      const result = await this.pool.query<Users>(
        'SELECT * FROM "users" WHERE id = $1;',
        [id],
      );
      return result.rows[0] || null;
    } catch (error: unknown) {
      if (error instanceof Error) console.error('DB error:', error.message);
      return null;
    }
  }

  async findUserByEmail(email: string): Promise<Users | null> {
    try {
      const result = await this.pool.query<Users>(
        'SELECT * FROM "users" WHERE email = $1;',
        [email],
      );
      return result.rows[0] || null;
    } catch (error: unknown) {
      if (error instanceof Error) console.error('DB error:', error.message);
      return null;
    }
  }

  async createUser({
    email,
    hashedPassword,
    name,
    id,
  }: NewUserDto): Promise<Users | null> {
    try {
      const result: QueryResult<Users> = await this.pool.query(
        `
      INSERT INTO "users" (id, email, password, name)
      VALUES($1, $2, $3, $4)
      RETURNING *;
      `,
        [id, email, hashedPassword, name],
      );

      return result.rows[0];
    } catch (error: unknown) {
      if (error instanceof Error) console.error('DB error:', error.message);
      return null;
    }
  }
}
