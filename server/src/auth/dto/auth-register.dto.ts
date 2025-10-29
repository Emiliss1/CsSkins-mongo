import { IsNumber, IsString, MaxLength, MinLength } from 'class-validator';

export class AuthRegisterDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(8)
  @MaxLength(32)
  password: string;

  @IsString()
  @MinLength(8, {
    message: 'Confirm password must be atleast 8 characters long',
  })
  @MaxLength(32, {
    message: 'Confirm password must be not longer than 32 characters',
  })
  confPassword: string;
}
