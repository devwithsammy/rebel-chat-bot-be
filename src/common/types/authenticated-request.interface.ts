import { Request } from 'express';
import { TUserRole } from 'src/auth/user.type';

export interface IAuthenticatedRequest extends Request {
  user?: {
    userId?: string;
    email?: string;
    role?: TUserRole;
  };
}
