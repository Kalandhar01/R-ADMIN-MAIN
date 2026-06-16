import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-body)", "Manrope", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "\"Bodoni Moda\"", "Didot", "Georgia", "serif"]
      },
      colors: {
        nearblack: "#111111",
        "executive-red": "#6D1018",
        "warm-gold": "#B8934F",
        warm: {
          50: "#ffffff",
          100: "#F5F3EF",
          200: "#E8E1D8",
          300: "#C9BDAF"
        },
        stonework: {
          400: "#9d9487",
          500: "#756f65",
          700: "#393734",
          900: "#161514",
          950: "#080807"
        },
        graphite: "#111214",
        goldline: "#B8934F",
        concrete: "#cbc5b9"
      },
      boxShadow: {
        cinema: "0 40px 120px rgba(0, 0, 0, 0.45)",
        gold: "0 0 46px rgba(196, 161, 91, 0.2)"
      }
    }
  },
  plugins: []
};

export default config;
