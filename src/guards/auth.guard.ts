import {
  CanActivate,
  ExecutionContext,
  // Inject,
  Injectable,
  // forwardRef,
} from '@nestjs/common';

import { AuthService } from 'src/auth/auth.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    // @Inject(forwardRef(() => AuthService))) // This is the old way to do it but it resolves circular dependency
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    try {
      const data = this.authService.checkToken(authorization.split(' ')[1]);

      request.tokenPayload = data;
      request.user = await this.userService.findByEmail(data.email);

      console.log(request.user);

      return true;
    } catch (error) {
      return false;
    }
  }
}
