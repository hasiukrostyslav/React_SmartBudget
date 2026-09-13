// hashedPassword matches the field name used when creating a user in the DB
export interface NewUserDto {
  id: string;
  name: string;
  email: string;
  hashedPassword: string;
}

export interface Users {
  id: string;
  name: string;
  email: string;
  emailVerified: string | null;
  image: string | null;
  password: string;
  createdAt: string;
  updatedAt: string;
}
