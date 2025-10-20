import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  login() {
    return 'Login service';
  }
  signup() {
    return 'Register service';
  }
}
