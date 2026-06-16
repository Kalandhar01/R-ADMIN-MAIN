import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}", "./src/lib/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", "Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"]
      },
      colors: {
        ink: "#101411",
        "forest-line": "#21362d",
        clay: "#b65f3c",
        brass: "#ba9a58",
        sage: "#6f7f63",
        cloud: "#f4f6f3"
      }
    }
  },
  plugins: []
};

export default config;
