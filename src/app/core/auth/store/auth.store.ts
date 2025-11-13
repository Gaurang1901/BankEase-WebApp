import {
  patchState,
  signalStore,
  withComputed,
  withHooks,
  withMethods,
  withState,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { initialState, User } from './auth.state';
import { computed, effect, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { catchError, EMPTY, pipe, switchMap, tap } from 'rxjs';
import { withPermissions } from '../../utils/permission.utils';
import { MessageService } from 'primeng/api';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { LoginCredentials } from '../models/login.model';

export const AuthStore = signalStore(
  { providedIn: 'root' },

  withState(initialState),

  withPermissions(),

  withComputed(({ token, user }) => ({
    isAuthenticated: computed(() => !!token()),
  })),

  withMethods(
    (
      store,
      authService = inject(AuthService),
      messageService = inject(MessageService),
      router = inject(Router)
    ) => {
      const methods = {
        login: rxMethod<LoginCredentials>(
          pipe(
            tap(() => patchState(store, { isLoading: true, error: null })),
            switchMap((credentials) =>
              authService.login(credentials).pipe(
                tap(({ data }) => {
                  console.log('Login successful');
                  // const user: User = jwtDecode(token);

                  authService.saveToken(data.token);
                  messageService.add({
                    key: 'custom-toast',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Login Successful',
                  });
                  const user: User = {
                    id: '1',
                    name: 'Dummy User',
                    email: 'dummy@example.com',
                    roles: 'ROLE_USER',
                  };

                  router.navigateByUrl('/');

                  patchState(store, {
                    user: user,
                    token: data.token,
                    isLoading: false,
                  });
                }),

                catchError((err) => {
                  console.error('Login error caught:', err);
                  patchState(store, {
                    error: 'Login Failed',
                    isLoading: false,
                  });
                  messageService.add({
                    key: 'custom-toast',
                    severity: 'error',
                    summary: 'Error',
                    detail: err.error.message,
                  });

                  return EMPTY;
                })
              )
            )
          )
        ),
        hydrateUser: rxMethod<void>(
          pipe(
            switchMap(() =>
              authService.getUserProfile().pipe(
                tap({
                  next: (user) => patchState(store, { user }),
                  error: () => {
                    authService.removeToken();
                    patchState(store, { user: null, token: null });
                  },
                })
              )
            )
          )
        ),
        logout: rxMethod<void>(
          pipe(
            tap(() => authService.removeToken()),
            tap(() => patchState(store, initialState)),
            tap(() => router.navigateByUrl('/login'))
          )
        ),
      };

      effect((onCleanup) => {
        const user = store.user();
        let timer: any;
        if (user?.exp) {
          const expireAtMins = user.exp * 1000;
          const timeout = expireAtMins - Date.now();
          const expirationMessage = 'Your session has expired.  ';
          if (timeout > 0) {
            timer = setTimeout(() => {
              methods.logout();
            }, timeout);
          } else {
            methods.logout();
          }
        }
        onCleanup(() => {
          clearTimeout(timer);
        });
      });

      effect(
        (onCleanup) => {
          const handleStorageChange = (event: StorageEvent) => {
            if (
              event.key === 'auth_token' &&
              event.newValue === null &&
              store.isAuthenticated()
            ) {
              methods.logout();
            }
          };

          window.addEventListener('storage', handleStorageChange);

          onCleanup(() => {
            window.removeEventListener('storage', handleStorageChange);
          });
        },
        { allowSignalWrites: true }
      );

      return methods;
    }
  ),

  withHooks({
    onInit({ hydrateUser, ...store }, authService = inject(AuthService)) {
      const initialToken = authService.getToken();
      if (initialToken) {
        patchState(store, { token: initialToken });
        hydrateUser();
      }
    },
  })
);
