import { Inject, Injectable } from '@nestjs/common';
import { Pool } from 'pg';
import type { User } from './users.type';
import { NewUserDto, SignUpDto } from '../auth/schemas/auth.schemas';

@Injectable()
export class UsersService {
  constructor(@Inject('PG_POOL') private pool: Pool) {}

  async findUserById(id: string): Promise<User | null> {
    try {
      const result = await this.pool.query<User>(
        'SELECT * FROM "User" WHERE id = $1;',
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
        'SELECT * FROM "User" WHERE email = $1;',
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
  }: NewUserDto): Promise<User | null> {
    try {
      const result = await this.pool.query(
        `
      INSERT INTO "User" (id, email, password, name)
      VALUES($1, $2, $3, $4)
      RETURNING *;
      `,
        [id, email, hashedPassword, name],
      );

      return result.rows[0] || null;
    } catch (error: unknown) {
      if (error instanceof Error) console.error('DB error:', error.message);
      return null;
    }
  }
}
