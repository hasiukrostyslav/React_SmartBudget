// hashedPassword matches the field name used when creating a user in the DB
export interface NewUserDto {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
}

// Column names exactly as `SELECT *` returns them (snake_case — the table was
// created by the Next/Prisma app with @map'd columns). name and password are
// nullable in the schema: accounts created there through OAuth have neither,
// and login must treat a null password as a mismatch, not a crash.
export interface Users {
  id: string;
  name: string | null;
  email: string;
  email_verified: Date | null;
  image: string | null;
  password: string | null;
  created_at: Date;
  updated_at: Date;
}
