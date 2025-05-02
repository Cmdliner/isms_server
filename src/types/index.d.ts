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

type BulkUploadResult = { success: number, failed: number, errors: any[] }

type SubjectGrade = 'A' | 'B' | 'C' | 'D' | 'E' | 'F';