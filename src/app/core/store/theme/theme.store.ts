import { patchState, signalStore, withComputed, withHooks, withMethods, withState } from "@ngrx/signals";
import { initialState, Theme } from './theme.state';
import { computed, effect, inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";

const THEME_STORAGE_KEY = 'app-theme';

export const ThemeStore = signalStore(
  {providedIn: 'root'},
  withState(initialState),

  // 2. Define computed signals for convenience
  withComputed(({ theme }) => ({
    isDarkMode: computed(() => theme() === 'dark'),
    isLightMode: computed(() => theme() === 'light'),
  })),

  // 3. Define methods to change the state
  withMethods((store) => ({
    setTheme(theme: Theme): void {
      patchState(store, { theme });
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    },
    toggleTheme(): void {
      const newTheme = store.theme() === 'light' ? 'dark' : 'light';
      patchState(store, { theme: newTheme });
      localStorage.setItem(THEME_STORAGE_KEY, newTheme);
    },
  })),

  // 4. Use lifecycle hooks for initialization and reactive side effects
  withHooks({
    onInit(store) {
      // --- Hydration from localStorage ---
      // When the store is created, check for a persisted theme.
      const persistedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
      if (persistedTheme) {
        patchState(store, { theme: persistedTheme });
      }

      // --- Reactive Side Effect for DOM Manipulation ---
      // Inject DOCUMENT for safe DOM access (good for SSR and testing)
      const document = inject(DOCUMENT);
      const htmlElement = document.documentElement;

      // This effect will run whenever the store.theme() signal changes.
      effect(() => {
        const currentTheme = store.theme();
        if (currentTheme === 'dark') {
          htmlElement.classList.add('my-app-dark');
        } else {
          htmlElement.classList.remove('my-app-dark');
        }
      });
    },
  })

)