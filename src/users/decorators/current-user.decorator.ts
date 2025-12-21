import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentUser = createParamDecorator(
  (
    data: never,
    context: ExecutionContext /* Can handle all kinds of requests not just HTTP */,
  ) => {
    const request = context.switchToHttp().getRequest();
    return request.currentUser;
  },
);
