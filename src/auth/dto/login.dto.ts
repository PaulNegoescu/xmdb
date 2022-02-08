import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail({ message: 'Please enter a valid email address.' })
  public email: string;

  @IsNotEmpty({ message: 'The password cannot be empty.' })
  @MinLength(6, {
    message: 'Your password should be at least 6 characters long.',
  })
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message:
      'Your password needs to contain lowercase and uppercase letters, numbers and a special character.',
  })
  public password: string;
}
