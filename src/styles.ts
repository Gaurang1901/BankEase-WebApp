import { definePreset } from '@primeng/themes';
import Aura from '@primeng/themes/aura';

export const MyPreset = definePreset(Aura, {
  semantic: {
    colorScheme: {
      light: {
        primary: {
          50: '#bfd4f0',
          100: '#9eb6d6',
          200: '#8ea7c9',
          300: '#7d98bc',
          400: '#5c79a1',
          500: '#3b5b87',
          600: '#1a3d6d',
          700: '#153157',
          800: '#102541',
          900: '#0a182c',
          1000: '#081221',
        },
        secondary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        destructive: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#FECDD3',
          300: '#FDA4AF',
          400: '#FB7185',
          500: '#F43F5E',
          600: '#E11D48',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
          950: '#4C0519',
        },
        foreground: {
          DEFAULT: '#000000',
        },
      },
      dark: {
        primary: {
          50: '#e8f0fb',
          100: '#d0e1f6',
          200: '#b9d2f1',
          300: '#a1c3ec',
          400: '#89b4e7',
          500: '#7296cc',
          600: '#5c79b1',
          700: '#465c96',
          800: '#30407b',
          900: '#1b2560',
          1000: '#121b4a',
        },
        secondary: {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
        },
        foreground: {
          DEFAULT: '#FFFFFF',
        },
        background: {
          DEFAULT: '#121212',
        },
      },
    },
  },
  components: {
    card: {
      body: {
        padding: '0',
      },
      colorScheme: {
        light: {
          root: {
            background: '{white.0}',
            color: '{foreground.DEFAULT}',
          },
        },
        dark: {
          root: {
            background: '{surface.900}',
            color: '{foreground.DEFAULT}',
          },
        },
      },
    },
    button: {
      colorScheme: {
        light: {
          info: {
            outlined: {
              root: {
                border: {
                  color: '#9B870C',
                },
              },
            },
          },
        },
      },
    },
    tooltip: {
      colorScheme: {
        light: {
          root: {
            background: '{primary.500}',
            color: '{surface.0}',
          },
          arrow: {
            background: '{primary.500}',
          },
        },
        dark: {
          root: {
            background: '{primary.500}',
            color: '{surface.0}',
          },
          arrow: {
            background: '{primary.500}',
          },
        },
      },
    },
  },
});
