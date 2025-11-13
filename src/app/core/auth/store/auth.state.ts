import { Role } from '../../utils/role';

export type ROLE = 'ADMIN' | 'USER';

export interface User {
  id: string;
  name: string;
  email: string;
  roles: 'ROLE_USER' | 'ROLE_ADMIN';
  exp?: number;
  userId?: string;
  accountId?: string;
  username?: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

export const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

export interface resetPasswordModel {
  userId: string;
  token: string;
  newPassword: string;
}
