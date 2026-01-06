import { Users } from '../modules/users/users.type';

declare global {
  namespace Express {
    interface Request {
      user?: Users | { id: string };
    }
  }
}
