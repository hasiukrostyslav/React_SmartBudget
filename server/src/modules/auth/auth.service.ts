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
    const token = await this.jwtService.signAsync(payload);

    return { access_token: token };
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
}
