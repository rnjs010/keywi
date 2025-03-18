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
      colors: {
        // text
        darkKiwi: '#4C7A0D',
        kiwi: '#70C400',
        lightKiwi: '#D6E8BE',
        black: '#000000', // main 이 아니라 black 으로 표시함
        darkGray: '#6D6D6D',
        gray: '#B7B7B7',
        littleGray: '#DBDBDB',
        white: '#FFFFFF',
        // background
        input: '#F7F7F7',
        img: 'rgba(0, 0, 0, 0.2)',
        modal: 'rgba(0, 0, 0, 0.5)', // tag랑 같이 쓰기
        pay: 'rgba(218, 237, 193, 0.3)',
        info: '#DAEDC1',
        // button
        default: '#70C400',
        hover: '#7ED40C',
        disabled: '#DAEDC1',
        pressed: '#579700',
      },
    },
  },
  plugins: [],
}
