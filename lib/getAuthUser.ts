import { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET || 'smartmock-secret-key';

export interface AuthUser {
    id: string;
    name: string;
    email: string;
    role: string;
    avatar: string;
    bio: string;
    age: number;
}

/**
 * Extracts the Bearer token from the Authorization header,
 * verifies its signature & expiry, then returns the decoded payload.
 *
 * No DB call — all data comes from the token itself.
 * Returns null if the token is missing, invalid, or expired.
 */
export async function getAuthUser(request: NextRequest): Promise<AuthUser | null> {
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader?.startsWith('Bearer ')) return null;

        const token = authHeader.split(' ')[1];
        if (!token) return null;

        const decoded = jwt.verify(token, JWT_SECRET) as AuthUser;

        return {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            role: decoded.role,
            avatar: decoded.avatar || '',
            bio: decoded.bio || '',
            age: decoded.age,
        };
    } catch {
        // Catches jwt.verify errors: TokenExpiredError, JsonWebTokenError, etc.
        return null;
    }
}