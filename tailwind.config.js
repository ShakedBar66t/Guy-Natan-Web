/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-zoom': 'pulseZoom 1.5s ease-in-out infinite',
      },
      keyframes: {
        pulseZoom: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.1)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '100%',
            color: '#333',
            'h1, h2, h3, h4, h5, h6': {
              color: '#002F42',
              fontWeight: '700',
            },
            a: {
              color: '#32a191',
              '&:hover': {
                color: '#002F42',
              },
            },
            ul: {
              listStyleType: 'disc',
              paddingRight: '2rem',
            },
            ol: {
              listStyleType: 'decimal',
              paddingRight: '2rem',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
