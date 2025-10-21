import bcrypt from 'bcrypt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { SignInDto, SignUpDto } from './schemas/auth.schemas';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login({ email, password }: SignInDto) {
    // Check if User exist
    const user = await this.usersService.findUserByEmail(email);
    if (!user) throw new UnauthorizedException('Invalid email or password!');

    // Compare password
    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword)
      throw new UnauthorizedException('Invalid email or password!');

    return { success: true, data: user };
  }

  signup() {
    return 'Register service';
  }
}
