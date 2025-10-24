import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import { createId } from '@paralleldrive/cuid2';
import { UsersService } from '../users/users.service';
import { SignInDto, SignUpDto } from './schemas/auth.schemas';
import { saltRounds } from '@/common/constants/constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async login({ email, password }: SignInDto) {
    // Check if User exist
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password!');

    // Compare password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      throw new UnauthorizedException('Invalid email or password!');

    // Create access token
    const payload = { sub: user.id, email: user.email };
    const access_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_ACCESS_SECRET,
      expiresIn: '15m',
    });

    // Create refresh token
    const refresh_token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWT_REFRESH_SECRET,
      expiresIn: '7d',
    });

    return {
      data: {
        success: true,
        user: { email: user.email },
      },
      access_token,
      refresh_token,
    };
  }

  async signup({ email, password, name }: SignUpDto) {
    // Check if User exist
    const existedUser = await this.usersService.findUserByEmail(email);
    if (existedUser)
      throw new UnauthorizedException(
        'An account with this email already exists.',
      );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Generate user ID
    const id = createId();

    // Create new user
    const newUser = await this.usersService.createUser({
      email,
      hashedPassword,
      name,
      id,
    });

    // Sign In

    // Send JWT Token
  }

  async refresh(refreshToken: string) {
    try {
      // Verify refresh token
      const payload = await this.jwtService.verifyAsync(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      // Create new access token
      const newAccessToken = await this.jwtService.signAsync(
        { sub: payload.sub, email: payload.email },
        {
          secret: process.env.JWT_ACCESS_SECRET,
          expiresIn: '15m',
        },
      );

      return { access_token: newAccessToken };
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }
}
