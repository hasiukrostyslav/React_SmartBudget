import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import helmet from 'helmet';
import { doubleCsrf } from 'csrf-csrf';
import cookieParser from 'cookie-parser';
import { NextFunction, Request, Response } from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());
  app.use(cookieParser());

  const allowedOrigins = ['http://localhost:5173', process.env.CLIENT_URL];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: (req) => process.env.CSRF_SECRET as string,
    getSessionIdentifier: (req: Request) => req.user?.id || req.ip || 'unknown',
    cookieName:
      process.env.NODE_ENV === 'production'
        ? '__Host-psifi.x-csrf-token'
        : 'psifi.x-csrf-token',
    cookieOptions: {
      sameSite: 'none',
      path: '/',
      httpOnly: false,
      secure: true,
    },
    ignoredMethods: ['GET'],
  });

  app
    .getHttpAdapter()
    .get('/api/auth/csrf-token', (req: Request, res: Response) => {
      const csrfToken = generateCsrfToken(req, res);

      res.json({ success: true, csrfToken });
    });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/api/auth/signout') {
      return next();
    }

    return doubleCsrfProtection(req, res, next);
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap().catch((err) => console.error(err));
