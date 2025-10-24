import { Body, Controller, Post, Res, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import {
  type SignInDto,
  SignInSchema,
  type SignUpDto,
  SignUpSchema,
} from './schemas/auth.schemas';
import { type Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(SignInSchema))
  async login(
    @Res({ passthrough: true }) response: Response,
    @Body() data: SignInDto,
  ) {
    const result = await this.authService.login(data);

    response.cookie('access_token', result.access_token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 24 * 60 * 60 * 1000,
    });

    return result.data;
  }

  @Post('signup')
  @UsePipes(new ZodValidationPipe(SignUpSchema))
  signup(@Body() data: SignUpDto) {
    return this.authService.signup(data);
  }
}
