/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1b4cb6', // 새로운 포인트 색상
          dark: '#163d94', // 어두운 포인트 색상
          light: '#2c5dd2', // 밝은 포인트 색상
        },
        secondary: '#121212', // 어두운 블랙 배경
        text: {
          DEFAULT: '#f8f8f8', // 밝은 텍스트 색상
          dark: '#a0a0a0', // 어두운 텍스트 색상
        },
        accent: '#ffffff',
        dark: {
          DEFAULT: '#121212', // 기본 어두운 배경
          light: '#1e1e1e', // 살짝 밝은 어두운 배경
          lighter: '#2a2a2a', // 더 밝은 어두운 배경
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.6s ease-out forwards',
        'fade-in': 'fadeIn 1s ease forwards',
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}