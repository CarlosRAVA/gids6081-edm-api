import { CanActivate, ExecutionContext, Injectable, ForbiddenException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";

export const ROLES_KEY = "roles";

// Decorator para marcar qué roles puede acceder a un endpoint
import { SetMetadata } from "@nestjs/common";
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si no hay roles requeridos, cualquiera puede acceder
    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest();
    const user = request["user"];

    if (!user || !requiredRoles.includes(user.role)) {
      throw new ForbiddenException("No tienes permisos para acceder a este recurso");
    }

    return true;
  }
}