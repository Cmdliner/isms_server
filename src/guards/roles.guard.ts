import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { UserRole } from "../lib/enums";

@Injectable()
export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            context.getHandler(),
            context.getClass()
        ]);
        if (!requiredRoles) return true;

        const request: Request = context.switchToHttp().getRequest()
        const user = request.user;

        return this.matchRoles(requiredRoles, user?.role)
    }

    private matchRoles(roles: string[], user_role: UserRole): boolean {
        return roles.some(r => r === user_role)
    }
}