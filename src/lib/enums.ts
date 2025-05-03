export enum UserRole {
    STUDENT = 'student',
    TEACHER = 'teacher',
    GUARDIAN = 'guardian',
    ADMIN = 'admin'
}

export enum MaritalStatus {
    SINGLE = 'single',
    MARRIED = 'married',
    WIDOWED = 'widowed',
    DIVORCED = 'divorced',
    OTHER = 'other'
}

export enum BloodGroup {
    A_POSTITIVE = 'A+',
    A_NEGATIVE = 'A-',
    B_POSITIVE = 'B+',
    B_NEGATIVE = 'B-',
    AB_POSITIVE = 'AB+',
    AB_NEGATIVE = 'AB-',
    O_POSITIVE = 'O+',
    O_NEGATIVE = 'O-',
}

export enum StudentEnrollmentStatus {
    ENROLLED = 'enrolled',
    SUSPENDED = 'suspended',
    EXPELLED = 'expelled',
    GRADUATED = 'graduated',
    UNKNOWN = 'unknown'
}

export enum AttendanceStatus {
    PRESENT = 'present', 
    ABSENT = 'absent', 
    LATE = 'late'
}

export enum Gender {
    M = 'M',
    F = 'F'
}