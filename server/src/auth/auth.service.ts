import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { AuthRegisterDto } from './dto/auth-register.dto';
import { AuthLoginDto } from './dto/auth-login.dto';

@Injectable()
export class AuthService {
  constructor(private usersRepository: UsersRepository) {}

  async signUp(authRegisterDto: AuthRegisterDto): Promise<void> {
    return this.usersRepository.createUser(authRegisterDto);
  }

  async signIn(authLoginDto: AuthLoginDto): Promise<{ accessToken: string }> {
    return this.usersRepository.signIn(authLoginDto);
  }
}
