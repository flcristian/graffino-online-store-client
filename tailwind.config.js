/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      maxHeight: {
        '136': '34rem',
      },
      minHeight: {
        '136': '34rem',
      },
      dropShadow: {
        'md': '0 1px 1px rgba(0, 0, 0, 0.5)',
        '2xl': '0 3px 2px rgba(0, 0, 0, 0.6)',
      },
      screens: {
        'minw': '0px',
        '2xs': '400px',
        'xs': '540px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        '3xl': '2000px'
      },
      width: {
        '86': '21.5rem',
        '112': '28rem',
        '126': '31.5rem',
        '256': '64rem'
      },
      height: {
        '20v': '20vh',
        '60v': '60vh',
      },
    }
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mytheme: {

          "primary": "#7c5d47",

          "secondary": "#997c57",

          "accent": "#150f0e",

          "neutral": "#ded5c7",

          "base-100": "#fcf6eb",

          "info": "#ded5c7",

          "success": "#ded5c7",

          "warning": "#503f37",

          "error": "#851b18",

          "granite": "#221f22"
        },
      },
    ],
  },
}
