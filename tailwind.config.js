/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
              './index.html',
            './tailwind.config.js',],
  
  daisyui: {
              themes: ["retro"],
            },
          
  plugins: [require('daisyui')],
}
