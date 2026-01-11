import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { StringValue } from 'ms';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '@/modules/users/users.module';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [AuthController],
  providers: [AuthService, UsersService],
  imports: [
    UsersModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: (process.env.JWT_EXPIRES_IN as StringValue) || '60s',
      },
    }),
  ],
})
export class AuthModule {}
