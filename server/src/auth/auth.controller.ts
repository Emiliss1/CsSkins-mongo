import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body() authRegisterDto: AuthRegisterDto): Promise<void> {
    return this.authService.signUp(authRegisterDto);
  }

  @Post('/signin')
  signIn(@Body() authLoginDto: AuthLoginDto): Promise<{ accessToken: string }> {
    return this.authService.signIn(authLoginDto);
  }
}
