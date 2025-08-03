/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {colors: {
        cream: '#FFFDF7',
        darkGray: '#263238',
        lightGray: '#F5F5DC',
        accent: '#F4C430',
        textPrimary: '#212121',
        textSecondary: '#757575',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },},
  },
  plugins: [],
}

