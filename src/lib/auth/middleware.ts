import { NextRequest, NextResponse } from 'next/server';
import { findUserById, findUserByApiKey } from '../db';
import prisma from '../db/prisma';
import { verifyToken, signToken } from './jwt';

// Middleware to authenticate API requests via JWT or API key
export async function authenticateApiRequest(
  request: NextRequest
): Promise<{ authenticated: boolean; userId?: string; error?: string }> {
  // Get Authorization header
  const authHeader = request.headers.get('Authorization');

  if (!authHeader) {
    return {
      authenticated: false,
      error: 'Missing Authorization header',
    };
  }

  // Check if it's a Bearer token
  if (!authHeader.startsWith('Bearer ')) {
    return {
      authenticated: false,
      error: 'Invalid Authorization header format',
    };
  }

  // Extract the token
  const token = authHeader.slice(7);

  if (!token) {
    return {
      authenticated: false,
      error: 'Missing token',
    };
  }

  // First try to verify as a JWT token
  const payload = verifyToken(token);
  if (payload && payload.userId) {
    // For development, use in-memory DB for now
    const user = findUserById(payload.userId);
    // For production, use Prisma
    // const user = await prisma.user.findUnique({ where: { id: payload.userId } });

    if (user && user.isActive) {
      return {
        authenticated: true,
        userId: user.id,
      };
    }
  }

  // If JWT verification fails, try as an API key
  const user = findUserByApiKey(token);
  // For production, use Prisma
  // const apiKey = await prisma.apiKey.findUnique({
  //   where: { keyHash: token },
  //   include: { user: true }
  // });
  // const user = apiKey?.user;

  if (user) {
    return {
      authenticated: true,
      userId: user.id,
    };
  }

  // Authentication failed
  return {
    authenticated: false,
    error: 'Invalid authentication token',
  };
}

// Middleware to handle authentication for API routes
export function withApiAuth<T extends unknown[]>(
  handler: (request: NextRequest, context: { userId: string }, ...args: T) => Promise<NextResponse> | NextResponse
) {
  return async function (request: NextRequest, ...args: T) {
    // Authenticate the request
    const { authenticated, userId, error } = await authenticateApiRequest(request);

    if (!authenticated) {
      return NextResponse.json(
        { error },
        { status: 401 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID not found' },
        { status: 401 }
      );
    }

    return handler(request, { userId }, ...args);
  };
}

// Generate a JWT token
export function generateToken(userId: string): string {
  return signToken(userId);
}
