export interface RefreshTokenPayload {
  sub: string;
  email: string;
  iat: number;
  exp: number;
}
