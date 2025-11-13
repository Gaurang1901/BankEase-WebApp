import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthStore } from '../store/auth.store';
import { LocalStorageService } from '../services/local-storage.service';

// Define public API endpoints that don't require authentication
const publicEndpoints = [
  '/api/auth/login',
  '/api/auth/signup',
  '/api/state',
  '/api/auth/forgot-password',
  '/api/auth/reset-password',
  '/api/auth/verify-email',
  '/api/auth/verify-otp',
];

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const authStore = inject(AuthStore);
  const authToken = inject(AuthStore).token();

  // Check if the request is going to a public endpoint
  const isPublicEndpoint = publicEndpoints.some((endpoint) =>
    req.url.includes(endpoint)
  );

  // If it's a public endpoint, skip token check and proceed with request
  if (isPublicEndpoint) {
    return next(req);
  }

  const tokenInStorage = localStorageService.getItem('auth_token');

  // For non-public endpoints, check token
  if (!tokenInStorage && !isPublicEndpoint) {
    authStore.logout();
    return next(req);
  }

  if (authToken) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${authToken}`,
      },
    });
  }

  return next(req);
};
