type ReqUser = {
    role: 'student' | 'guardian' | 'teacher' | 'admin';
    sub: string;
    iat: number;
    exp: number;
}

type ErrorResponse = {
    error: boolean;
    message: string | string[];
    timestamp: string;
    reason?: string;
}