import { IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export class UserUpdatePasswordDto {
  @IsString()
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, { message: 'New password must be longer than 8 characters' })
  @MaxLength(32, {
    message: 'New password must be not longer than 32 characters',
  })
  newPassword: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Confirm new password must be longer than 8 characters',
  })
  @MaxLength(32, {
    message: 'Confirm new password must be not longer than 32 characters',
  })
  confNewPassword: string;
}
