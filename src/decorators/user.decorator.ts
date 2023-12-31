import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (filter: string, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    if (filter) {
      return request.user[filter];
    } else return request.user;
  },
);
