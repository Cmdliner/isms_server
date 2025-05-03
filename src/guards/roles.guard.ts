import { CanActivate, ExecutionContext } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request } from "express";
import { Roles } from "../decorators/roles.decorator";
import { UserRole } from "../lib/enums";

export class RolesGuard implements CanActivate {

    constructor(private reflector: Reflector) { }
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const roles = this.reflector.get(Roles, context.getHandler);
        if (!roles) return true;

        const request: Request = context.switchToHttp().getRequest()
        const user = request.user;

        return this.matchRoles(roles, user.role)
    }

    private matchRoles(roles: string[], user_role: UserRole): boolean {
        return roles.some(r => r === user_role)
    }
}