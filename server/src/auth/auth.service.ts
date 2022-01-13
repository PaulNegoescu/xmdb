import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  public constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  public async validateUser(
    loginDto: LoginDto,
  ): Promise<Omit<User, 'password'>> {
    const { email, password } = loginDto;
    const foundUser = await this.usersService.user({ email });
    if (!foundUser) {
      return null;
    }
    const isOk = await this.usersService.validatePassword(
      password,
      foundUser.password,
    );

    if (!isOk) {
      return null;
    }
    const { password: pass, ...userWithoutPass } = foundUser;
    return userWithoutPass;
  }

  async login(user: User) {
    const payload = { username: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  public async register(CreateUserDto: CreateUserDto) {
    const user = await this.usersService.create(CreateUserDto);
    return this.login(user);
  }
}
