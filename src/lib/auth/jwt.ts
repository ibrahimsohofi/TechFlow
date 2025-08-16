import * as jwt from 'jsonwebtoken';

// Make sure to set a secure JWT_SECRET in production
const JWT_SECRET = process.env.JWT_SECRET || 'development-secret-key-change-in-production';

interface JwtPayload {
  userId: string;
  role?: string;
  organizationId?: string;
  exp?: number;
}

// Sign a new JWT token
export function signToken(userId: string, expiresIn = '24h'): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn });
}

// Verify and decode a JWT token
export function verifyToken(token: string): JwtPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as JwtPayload;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

// Decode a token without verifying (for debugging or token inspection)
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload;
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}
