import { LoginDto } from './login.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  Matches,
  MinLength,
} from 'class-validator';

export class CreateUserDto extends LoginDto {
  @IsNotEmpty({ message: 'Please specify a first name.' })
  public firstName: string;

  @IsNotEmpty({ message: 'Please specify a last name.' })
  public lastName: string;

  @IsOptional()
  public roleId: string;
}
