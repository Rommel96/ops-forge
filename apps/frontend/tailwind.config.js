/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        surface: {
          900: '#0F172A',
          800: '#111827',
          700: '#1E293B',
          600: '#334155',
        },
        text: {
          primary: '#F8FAFC',
          secondary: '#E2E8F0',
          label: '#CBD5E1',
          muted: '#94A3B8',
          placeholder: '#64748B',
        },
        accent: {
          blue: '#3B82F6',
          violet: '#7C3AED',
        },
        priority: {
          'low-bg': '#14532D',
          'low-text': '#BBF7D0',
          'medium-bg': '#78350F',
          'medium-text': '#FDE68A',
          'high-bg': '#7F1D1D',
          'high-text': '#FECACA',
        },
        status: {
          'pending-bg': '#3F1D7A',
          'pending-text': '#DDD6FE',
          'progress-bg': '#1E3A8A',
          'progress-text': '#BFDBFE',
          'completed-bg': '#334155',
          'completed-text': '#E2E8F0',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        card: '12px',
        input: '10px',
      },
      boxShadow: {
        card: '0 6px 14px rgba(11, 18, 32, 0.2)',
        'card-login': '0 12px 28px rgba(2, 6, 23, 0.4)',
        glow: '0 6px 16px rgba(29, 78, 216, 0.33)',
      },
    },
  },
  plugins: [],
};
