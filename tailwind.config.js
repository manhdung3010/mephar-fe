/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      colors: {
        'red-main': '#D64457',
        'black-main': '#0F1824',
        'gray-main': '#A3A8AF',
      },
      height: {
        'full-screen': '100vh',
      },
      backgroundImage: (theme) => ({
        banner: "url('/assets/images/jpg/banner1.jpg')",
      }),
    },
  },
  plugins: [],
};
