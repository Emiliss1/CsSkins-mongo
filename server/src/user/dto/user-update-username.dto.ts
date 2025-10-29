import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserUpdateUsernameDto {
  @IsString()
  @MinLength(5)
  @MaxLength(20)
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
