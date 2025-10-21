import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ZodValidationPipe } from '@/common/pipes/zod-validation.pipe';
import {
  type SignInDto,
  SignInSchema,
  type SignUpDto,
  SignUpSchema,
} from './schemas/auth.schemas';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ZodValidationPipe(SignInSchema))
  login(@Body() data: SignInDto) {
    return this.authService.login(data);
  }

  @Post('signup')
  @UsePipes(new ZodValidationPipe(SignUpSchema))
  signup(@Body() data: SignUpDto) {
    return this.authService.signup(data);
  }
}
