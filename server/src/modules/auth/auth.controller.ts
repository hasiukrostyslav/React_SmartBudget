import {
  Body,
  Controller,
  Post,
  Redirect,
  Req,
  Res,
  UnauthorizedException,
  UsePipes,
} from '@nestjs/common';
import type { Response, Request } from 'express';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import {
  type SignInDto,
  type SignUpDto,
  SignInSchema,
  SignUpSchema,
} from './schemas/auth.schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(SignInSchema))
  @Redirect('/dashboard', 301)
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
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refresh_token', result.refresh_token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result.data;
  }

  @Post('signup')
  @UsePipes(new ZodValidationPipe(SignUpSchema))
  @Redirect('/dashboard', 301)
  async signup(
    @Res({ passthrough: true }) response: Response,
    @Body() data: SignUpDto,
  ) {
    const result = await this.authService.signup(data);

    response.cookie('access_token', result.access_token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    response.cookie('refresh_token', result.refresh_token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result.data;
  }

  @Post('refresh')
  async refresh(
    @Req() request: Request,
    @Res({ passthrough: true }) response: Response,
  ) {
    const refreshToken = request.cookies['refresh_token'];
    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token is missing');
    }

    const result = await this.authService.refresh(refreshToken);

    response.cookie('access_token', result.access_token, {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60 * 1000,
    });

    return { success: true };
  }

  @Post('signout')
  signout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token');
    response.clearCookie('refresh_token', { path: '/auth/refresh' });

    return { message: 'Logged out' };
  }
}
