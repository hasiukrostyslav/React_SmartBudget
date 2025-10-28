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
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true,
  });

  const { generateCsrfToken, doubleCsrfProtection } = doubleCsrf({
    getSecret: (req) => process.env.CSRF_SECRET as string,
    getSessionIdentifier: (req) => req.user?.id || req.ip,
    cookieName:
      process.env.NODE_ENV === 'production'
        ? '__Host-psifi.x-csrf-token'
        : 'psifi.x-csrf-token',
    cookieOptions: {
      sameSite: 'lax',
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
    },
    ignoredMethods: ['GET'],
  });

  app
    .getHttpAdapter()
    .get('/api/auth/csrf-token', (req: Request, res: Response) => {
      const csrfToken = generateCsrfToken(req, res);

      res.json({ success: true });
    });

  app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/api/auth/signout') {
      return next();
    }

    return doubleCsrfProtection(req, res, next);
  });

  await app.listen(process.env.PORT ?? 3001);
}
bootstrap();
