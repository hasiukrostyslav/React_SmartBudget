declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        sub: string;
        email: string;
        iat: number;
        exp: number;
      };
    }
  }
}

export {};
