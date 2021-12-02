import { Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersService } from '../users.service';

@Injectable()
export class AuthService {
  public constructor(private usersService: UsersService) {}

  public async login(email, password) {
    const foundUser = await this.usersService.user({ email });
    if (!foundUser) {
      throw new UnauthorizedException();
    }
    const isOk = await this.usersService.validatePassword(
      password,
      foundUser.password,
    );

    if (!isOk) {
      throw new UnauthorizedException();
    }

    return foundUser;
  }

  public async register(CreateUserDto: CreateUserDto) {
    return this.usersService.create(CreateUserDto);
  }
}
