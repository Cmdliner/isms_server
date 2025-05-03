import { UserRole } from "./lib/enums";

declare global {
    namespace Express {
        interface Request {
            user: {
                sub: string;
                role: UserRole;
            }
        }
    }
}