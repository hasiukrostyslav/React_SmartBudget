import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(private readonly usersService: UsersService) {}

  async login() {
    const user = await this.usersService.findUserByEmail('alex@mail.com');

    if (!user) return null;
    return user;
  }

  signup() {
    return 'Register service';
  }
}
