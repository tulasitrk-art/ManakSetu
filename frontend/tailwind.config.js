/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        maroon: {
          50: "#FDF2F2",
          100: "#FCE8E8",
          200: "#F8C5C7",
          300: "#F1999C",
          400: "#E35A5F",
          500: "#D32F36",
          600: "#A9181E",
          700: "#7B1113", // Primary Deep Maroon
          800: "#580C0E", // Rich Crimson Maroon
          900: "#3D080A",
          950: "#220304",
        },
        slate: {
          850: "#151F2E",
          950: "#0B111B",
        }
      },
      fontFamily: {
        serif: ["Merriweather", "Georgia", "serif"],
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      boxShadow: {
        'portal': '0 4px 20px -2px rgba(123, 17, 19, 0.08), 0 2px 6px -1px rgba(0, 0, 0, 0.04)',
        'portal-lg': '0 10px 30px -4px rgba(123, 17, 19, 0.12), 0 4px 10px -2px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
};
