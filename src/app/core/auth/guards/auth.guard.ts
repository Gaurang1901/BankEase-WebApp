import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthStore } from '../store/auth.store';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authStore = inject(AuthStore);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.getToken()) {
    if (authStore.user()?.exp) {
      const currentTime = Math.floor(Date.now() / 1000);
      if (authStore.user()?.exp! < currentTime) {
        authStore.logout();
        return router.parseUrl('/login');
      }
    }
    return true;
  }
  return router.parseUrl('/login');
};
