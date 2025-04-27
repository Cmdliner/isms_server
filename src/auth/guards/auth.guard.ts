import { CanActivate, ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private configService: ConfigService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = this.extractTokenFromHeader(request);
        if (!token) throw new UnauthorizedException('Authentication failed!');

        try {
            const payload = await this.jwtService.verifyAsync(token, { secret: this.configService.get<string>('ACCESS_SECRET') });
            request.user = payload;
        } catch (error) {
            throw new ForbiddenException('Authentication failed!');
        }
        return true;
    }

    private extractTokenFromHeader(request: Request): string | undefined {
        const [authType, token] = request.headers.authorization?.split(" ") as string[] ?? [];

        return authType === "Bearer" ? token : undefined;
    }
}