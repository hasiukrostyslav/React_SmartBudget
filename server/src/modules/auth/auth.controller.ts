import {
  Body,
  Controller,
  HttpCode,
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

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(SignInSchema))
  @HttpCode(200)
  // @Redirect('/api/dashboard', 301)
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
      path: '/api/auth/refresh',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return result.data;
  }

  @Post('signup')
  @UsePipes(new ZodValidationPipe(SignUpSchema))
  // @Redirect('/api/dashboard', 301)
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
  @HttpCode(200)
  signout(@Res({ passthrough: true }) response: Response) {
    response.clearCookie('access_token', {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
    });

    response.clearCookie('refresh_token', {
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true,
      sameSite: 'lax',
      path: '/auth/refresh',
    });

    response.clearCookie(
      process.env.NODE_ENV === 'production'
        ? '__Host-psifi.x-csrf-token'
        : 'psifi.x-csrf-token',
      {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: false,
        sameSite: 'lax',
        path: '/',
      },
    );

    return { message: 'Logged out' };
  }
}
