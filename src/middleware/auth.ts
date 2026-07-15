import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User.js';
import { adminAuth } from '../lib/firebase-admin.js';

export interface AuthRequest extends Request {
  user?: any;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  
  try {
    let userId = '';
    let userEmail = '';
    
    if (adminAuth) {
      try {
        const decodedToken = await adminAuth.verifyIdToken(token);
        userId = decodedToken.uid;
        userEmail = decodedToken.email || '';
      } catch (err) {
        console.warn('Firebase ID token verification failed:', err);
        return res.status(401).json({ error: 'Invalid or expired authentication token' });
      }
    } else {
        // If firebase admin is not initialized
        return res.status(500).json({ error: 'Server authentication misconfigured' });
    }

    let user = null;
    if (userEmail) {
      user = await (User as any).findOne({ email: userEmail });
    }
    
    if (!user) {
      user = { _id: userId, email: userEmail, role: 'user' };
    }
    
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};
