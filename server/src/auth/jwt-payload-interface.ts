import { Role } from './roles.enum';

export interface JwtPayLoad {
  username: string;
  role: Role;
}
