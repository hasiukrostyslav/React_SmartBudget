import { Router } from 'express';

import { authMiddleware } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  csrfTokenController,
  loginController,
  refreshController,
  sessionController,
  signoutController,
  signupController,
} from './auth.controller';
import { SignInSchema, SignUpSchema } from './auth.schemas';

const router = Router();

router.post('/login', validate(SignInSchema), loginController);
router.post('/signup', validate(SignUpSchema), signupController);
router.post('/refresh', refreshController);
// CSRF-exempt via skipCsrfProtection in middleware/csrf.middleware.ts
router.post('/signout', signoutController);
router.get('/session', authMiddleware, sessionController);
router.get('/csrf-token', csrfTokenController);

export default router;
