import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { Role } from 'src/enums/role.enum';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    // o this.reflector.getAllAndOverride('roles', [  ]) retorna o valor do decorator @Roles() que foi passado no controller, onde o primeiro parâmetro é o handler e o segundo é a classe
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) {
      return true;
    }

    const { user } = context.switchToHttp().getRequest();
    const role = requiredRoles.filter((role) => role === user.role);

    if (role.length === 0) {
      throw new UnauthorizedException({
        cause: 'RoleGuard',
        message: 'You do not have permission to access this resource',
      });
    }

    return role.length > 0;
  }
}
