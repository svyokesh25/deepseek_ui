/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        xn: {
          bg: '#ffffff',
          panel: '#ffffff',
          panel2: '#f5f7fa',
          toolbar: '#ffffff',
          border: '#e3e6eb',
          border2: '#d4d9e0',
          text: '#131722',
          dim: '#5d6673',
          mute: '#9aa3b0',
          up: '#089981',
          down: '#f23645',
          accent: '#2962ff',
          accent2: '#1e88e5',
          buy: '#0072fd',
          sell: '#ff5722',
          hover: '#f0f3fa',
          active: '#e3ebff',
          gold: '#f5bf23'
        }
      },
      fontFamily: {
        sans: ['"Roboto"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
        compact: ['"Roboto"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif']
      },
      fontSize: { '2xs': '10px' }
    }
  },
  plugins: []
}
