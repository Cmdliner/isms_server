type ReqUser = {
    role: 'student' | 'guardian' | 'teacher' | 'admin';
    sub: string;
    iat: number;
    exp: number;
}