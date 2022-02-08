import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from '@prisma/client';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'email' });
  }

  async validate(email, password): Promise<Omit<User, 'password'>> {
    const loginDto = { email, password };
    const user = await this.authService.validateUser(loginDto);
    if (user === null) {
      throw new UnauthorizedException(
        'The credentials provided did not match any of our records.',
      );
    }
    return user;
  }
}
