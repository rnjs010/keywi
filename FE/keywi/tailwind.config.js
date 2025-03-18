/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        pretendard: ['Pretendard'],
      },
      fontSize: {
        xs: '12px', // Caption 2
        sm: '14px', // Caption 1
        base: '16px', // Body 1
        lg: '18px', // Body 2
        xl: '20px', // Title 3
        '2xl': '24px', // Title 2
        '3xl': '30px', // Title 1
      },
    },
  },
  plugins: [],
}
