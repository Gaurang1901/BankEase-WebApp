import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { AuthService } from '../services/auth.service';

export const RoleGuard: CanActivateFn = (route, state): boolean | UrlTree => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  const token = authService.getToken();

  if (!token) {
    return router.parseUrl('/login');
  }

  const user = authStore.user();
  if (user?.exp) {
    const currentTime = Math.floor(Date.now() / 1000);
    if (user.exp < currentTime) {
      authStore.logout();
      return router.parseUrl('/login');
    }
  }

  const url = state?.url?.toLowerCase() ?? '';
  const roles = (user?.roles ?? '') as unknown as string;

  if (url.startsWith('/user')) {
    if (!roles.includes('user')) {
      // not authorized
      return router.parseUrl('/login');
    }
  }

  if (url.startsWith('/admin')) {
    if (roles.includes('user')) {
      return router.parseUrl('/login');
    }
  }

  return true;
};
