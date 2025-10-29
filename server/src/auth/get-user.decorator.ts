import { createParamDecorator } from '@nestjs/common';
import { User } from './user.schema';

export const GetUser = createParamDecorator((_, ctx): User => {
  const req = ctx.switchToHttp().getRequest();

  return req.user;
});
