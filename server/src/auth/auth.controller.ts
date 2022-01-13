import {
  Body,
  Controller,
  HttpCode,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post(['/signup', '/register'])
  @HttpCode(200)
  createUser(@Body() body: CreateUserDto) {
    return this.authService.register(body);
  }

  @UseGuards(LocalAuthGuard)
  @Post(['/signin', '/login'])
  @HttpCode(200)
  signIn(@Request() req) {
    return this.authService.login(req.user);
  }
}
