import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';

import { DatabaseModule } from './db/db.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { AuthMiddleware } from './auth/auth.middleware';

@Module({
  imports: [DatabaseModule, AuthModule, ConfigModule.forRoot()],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('auth');
  }
}
