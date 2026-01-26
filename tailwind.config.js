import { info } from 'console';
import { buildErrorMessage } from 'vite';

/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // cheongyeon blue
        primary: {
            50: "#e0f7fa",
            100: "#b2ebf2",
            200: "#8ae0eb",
            300: "#54d2e2",
            400: "#33c9dd",
            500: "#00bcd4",   
            DEFAULT: "#00bcd4",  // primary default color
        },
        // cheongyeon orange
        secondary: {
            50: "#fff0f0",
            400:"#ff8989",
            500: "#ff6b6b",
            DEFAULT: "#ff6b6b",  // secondary default color
        },
        semantic: {
          success: "#4CAF50",
          warning: "#FFC107",
          error: "#F44336",
          info: "#2196F3",
          notify: "#9CA9AB",
          badge: "#004B82",
        },
        gray : {
          white : "#ffffff",
          50 : "#fafafa",
          100 : "#f5f5f5",
          200 : "#eeeeee",
          300 : "#e0e0e0",
          400 : "#bdbdbd",
          500 : "#9e9e9e",
          600 : "#757575", //TXT/04
          700 : "#616161",
          800 : "#424242",
          900 : "#212121",
          icon : "#b2c2ce",
          black : "#000000", 
        }
      },
      fontFamily: {
        sans: ['Pretendard', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
      },

      fontSize: {
        // Display
        'display-l': ['32px', { lineHeight: '40px', fontWeight: '400' }],      // L · 32/40
        'display-m': ['24px', { lineHeight: '32px', fontWeight: '400' }],      // M · 24/32
        'display-s': ['20px', { lineHeight: '28px', fontWeight: '600' }],      // S · 20/28
        'display-xs': ['18px', { lineHeight: '24px', fontWeight: '600' }],     // XS · 18/24
        
        // Body
        'body-l': ['16px', { lineHeight: '24px', fontWeight: '400' }],         // L · 16/24
        'body-m': ['14px', { lineHeight: '20px', fontWeight: '400' }],         // M · 14/20
        'body-m-bold': ['14px', { lineHeight: '20px', fontWeight: '700' }],    // M(bold) · 14/20
        'body-s': ['12px', { lineHeight: '16px', fontWeight: '600' }],         // S · 12/16
        'body-l-bold': ['16px', { lineHeight: '24px', fontWeight: '700' }],    // L(bold) · 16/24
        
        // Label
        'label-l': ['14px', { lineHeight: '20px', fontWeight: '400' }],        // L · 14/20
        'label-m': ['12px', { lineHeight: '16px', fontWeight: '400' }],        // M · 12/16
        'label-caption': ['10px', { lineHeight: '14px', fontWeight: '400' }],  // Caption · 10/14
        'label-l-14': ['14px', { lineHeight: '20px', fontWeight: '400' }],     // L · 14/20
        'label-l-regular': ['12px', { lineHeight: '16px', fontWeight: '400' }], // L (regular) · 12/16
        
        // Price
        'price-l': ['20px', { lineHeight: '28px', fontWeight: '600' }],        // L · 20/28
        'price-m': ['16px', { lineHeight: '24px', fontWeight: '600' }],        // M · 16/24
        
        // CTA
        'cta-m': ['16px', { lineHeight: '24px', fontWeight: '500' }],          // M · 16/24
      },
    },
  },
  plugins: [],
}