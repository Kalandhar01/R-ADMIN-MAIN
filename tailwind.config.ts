import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: "class",
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-manrope)", "Manrope", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-cormorant)", "\"Cormorant Garamond\"", "Georgia", "serif"],
        manrope: ["var(--font-manrope)", "Manrope", "Inter", "system-ui", "sans-serif"],
        cormorant: ["var(--font-cormorant)", "\"Cormorant Garamond\"", "Georgia", "serif"]
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        admin: {
          bg: "#0A0A0A",
          surface: "#111111",
          hover: "#151515",
          border: "#1F1F1F",
          primary: "#D6B45F",
          accent: "#D6B45F",
          text: "#FAFAFA",
          muted: "#A1A1AA",
          gold: "#b8860b",
          "gold-light": "#d4a843",
          "gold-dark": "#9a7209",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      boxShadow: {}
    }
  },
  plugins: [tailwindcssAnimate]
};

export default config;
