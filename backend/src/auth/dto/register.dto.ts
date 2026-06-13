import { IsString, MinLength, Matches } from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3, { message: 'username must have at least 3 characters' })
  username: string;

  @IsString()
  @MinLength(8, { message: 'password must have at least 8 characters' })
  @Matches(/^(?=.*[A-Z])(?=.*\d).+$/, {
    message: 'password must contain at least one uppercase letter and one number',
  })
  password: string;
}
