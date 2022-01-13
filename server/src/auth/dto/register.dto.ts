import { LoginDto } from '../../auth/dto/login.dto';
import { IsNotEmpty } from 'class-validator';

export class RegisterDto extends LoginDto {
  @IsNotEmpty({ message: 'Please specify a first name.' })
  public firstName: string;

  @IsNotEmpty({ message: 'Please specify a last name.' })
  public lastName: string;
}
