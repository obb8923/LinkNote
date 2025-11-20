/** @type {import('tailwindcss').Config} */

module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        'p-regular': ['Pretendard-Regular'],
        'p-semibold': ['Pretendard-SemiBold'],
        'p-extrabold': ['Pretendard-ExtraBold'],
        'p-black': ['Pretendard-Black'],
      },
      colors: {
        'background': '#fcfcfc',
        'white': '#fefefe',
        'black': '#191919',
        'primary':'#497af4',
        'blue-chip': {
          '50': '#eef0fe',
          '100': '#d7ddfc',
          '200': '#b4c1fa',
          '300': '#93a8f8',
          '400': '#7190f6',
          '500': '#497af4',
          '600': '#2767e3',
          '700': '#1d4fb2',
          '800': '#11367e',
          '900': '#061c49',
          '950': '#020f2e',
        }
      },
    },
  },
  plugins: [],
}; 
