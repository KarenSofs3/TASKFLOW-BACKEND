/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        status: {
          pendiente: '#F59E0B',   // Amarillo / Ámbar
          cola: '#3B82F6',        // Azul
          procesando: '#8B5CF6',  // Morado / Púrpura
          respondida: '#10B981',  // Verde / Esmeralda
          error: '#EF4444',       // Rojo
        }
      }
    },
  },
  plugins: [],
}
