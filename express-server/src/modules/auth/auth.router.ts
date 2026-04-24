import { Router } from 'express';
import { validate } from '../../middleware/validate.middleware';
import { authMiddleware } from '../../middleware/auth.middleware';
import { SignInSchema, SignUpSchema } from './auth.schemas';
import {
  loginController,
  signupController,
  refreshController,
  signoutController,
  sessionController,
  csrfTokenController,
} from './auth.controller';

const router = Router();

router.post('/login', validate(SignInSchema), loginController);
router.post('/signup', validate(SignUpSchema), signupController);
router.post('/refresh', refreshController);
router.post('/signout', signoutController); // CSRF is bypassed in app.ts for this route
router.get('/session', authMiddleware, sessionController);
router.get('/csrf-token', csrfTokenController);

export default router;
