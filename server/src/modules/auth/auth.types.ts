export interface JwtPayload {
  sub: string;
  email: string;
}

export interface RefreshTokenPayload extends JwtPayload {
  iat: number;
  exp: number;
}

export interface Tokens {
  access_token: string;
  refresh_token: string;
}
