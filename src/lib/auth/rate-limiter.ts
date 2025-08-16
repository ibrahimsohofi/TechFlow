import { NextRequest, NextResponse } from 'next/server';

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
  message?: string;
  skipSuccessfulRequests?: boolean;
}

interface RateLimitStore {
  count: number;
  resetTime: number;
}

// In-memory store for rate limiting (use Redis in production)
const requestCounts = new Map<string, RateLimitStore>();

// Different rate limiters for different endpoints
export const rateLimiters = {
  // Authentication endpoints - stricter limits
  auth: {
    maxRequests: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many authentication attempts, please try again later.',
  },

  // API endpoints - moderate limits
  api: {
    maxRequests: 100,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many API requests, please try again later.',
  },

  // Scraper operations - lower limits (resource intensive)
  scraper: {
    maxRequests: 10,
    windowMs: 60 * 1000, // 1 minute
    message: 'Too many scraper requests, please try again later.',
  },

  // Data export - very limited (resource intensive)
  export: {
    maxRequests: 3,
    windowMs: 5 * 60 * 1000, // 5 minutes
    message: 'Too many export requests, please try again later.',
  },

  // General rate limit
  general: {
    maxRequests: 200,
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests, please try again later.',
  }
};

export function createRateLimiter(options: RateLimitOptions) {
  return async (request: NextRequest): Promise<NextResponse | null> => {
    const identifier = getClientIdentifier(request);
    const key = `${identifier}:${options.maxRequests}:${options.windowMs}`;

    const now = Date.now();
    const store = requestCounts.get(key);

    if (!store || now > store.resetTime) {
      // First request or window expired
      requestCounts.set(key, {
        count: 1,
        resetTime: now + options.windowMs,
      });
      return null; // Allow request
    }

    if (store.count >= options.maxRequests) {
      // Rate limit exceeded
      const remainingTime = Math.ceil((store.resetTime - now) / 1000);

      return NextResponse.json(
        {
          error: options.message || 'Rate limit exceeded',
          retryAfter: remainingTime,
        },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': options.maxRequests.toString(),
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': store.resetTime.toString(),
            'Retry-After': remainingTime.toString(),
          },
        }
      );
    }

    // Increment counter
    store.count++;
    return null; // Allow request
  };
}

function getClientIdentifier(request: NextRequest): string {
  // Try to get IP from various headers (for reverse proxies)
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const cfConnectingIp = request.headers.get('cf-connecting-ip');

  const ip = forwarded?.split(',')[0] || realIp || cfConnectingIp || 'unknown';

  // Fallback to user agent + ip for better uniqueness
  const userAgent = request.headers.get('user-agent') || 'unknown';

  return `${ip}:${userAgent.slice(0, 50)}`; // Truncate UA to prevent abuse
}

// Honeypot detection for malicious requests
export function detectHoneypot(request: NextRequest): boolean {
  const suspiciousHeaders = [
    'x-forwarded-host',
    'x-cluster-client-ip',
    'x-real-ip',
  ];

  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const suspiciousUAs = ['bot', 'crawler', 'scanner', 'spider'];

  // Check for suspicious headers combinations
  const headerCount = suspiciousHeaders.filter(header =>
    request.headers.has(header)
  ).length;

  // Check for suspicious user agents
  const hasSuspiciousUA = suspiciousUAs.some(ua => userAgent.includes(ua));

  // Check for missing common headers
  const hasReferer = request.headers.has('referer');
  const hasAcceptLanguage = request.headers.has('accept-language');

  return headerCount > 2 || (hasSuspiciousUA && !hasReferer && !hasAcceptLanguage);
}

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, store] of requestCounts.entries()) {
    if (now > store.resetTime) {
      requestCounts.delete(key);
    }
  }
}, 60 * 1000); // Clean up every minute
