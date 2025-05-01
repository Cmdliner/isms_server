export const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;

export const IS_PRODUCTION = process.env.NODE_ENV === 'production';

export const ACADEMIC_SESSION_REGEX = /^\d{4}\/\d{4}$/;