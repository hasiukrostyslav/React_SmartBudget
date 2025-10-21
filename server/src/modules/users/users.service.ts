import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import type { User } from './users.type';

@Injectable()
export class UsersService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async findUserById(id: string): Promise<User | null> {
    try {
      const result = await this.pool.query<User>(
        'SELECT * FROM "User" WHERE id = $1',
        [id],
      );
      return result.rows[0] || null;
    } catch (error: unknown) {
      if (error instanceof Error) console.error('DB error:', error.message);
      return null;
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const result = await this.pool.query<User>(
        'SELECT * FROM "User" WHERE email = $1',
        [email],
      );
      return result.rows[0] || null;
    } catch (error: unknown) {
      if (error instanceof Error) console.error('DB error:', error.message);
      return null;
    }
  }
}
