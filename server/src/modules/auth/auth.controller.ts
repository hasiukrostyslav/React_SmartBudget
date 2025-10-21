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
  login(@Body() body: SignInDto) {
    return this.authService.login(body);
  }

  @Post('signup')
  signup() {
    this.authService.signup();
  }
}
