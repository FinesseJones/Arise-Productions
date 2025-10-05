import jwt from 'jsonwebtoken';
import { APICallMeta, Middleware } from 'encore.dev/api';
import { Header } from 'encore.dev/api';

export interface AuthUser {
  id: string;
  email: string;
}

// Encore auth middleware
export const requireAuth: Middleware = async (req: APICallMeta, next) => {
  const authHeader = req.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as AuthUser;
    // Attach user to request metadata
    (req as any).user = decoded;
    return next(req);
  } catch (error) {
    throw new Error('Invalid token');
  }
};

// Helper to get authenticated user from request
export function getAuthUser(req: APICallMeta): AuthUser {
  return (req as any).user;
}
