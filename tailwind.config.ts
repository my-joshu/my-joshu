/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        btn: {
          background: "hsl(var(--btn-background))",
          "background-hover": "hsl(var(--btn-background-hover))",
        },
      },
    },
    borderRadius: {
      "lg": "var(--radius)",
      "md": "calc(var(--radius) - 2px)",
      "sm": "calc(var(--radius) - 4px)",
    },
    keyframes: {
      "accordion-down": {
        "from": {
          "height": "0",
        },
        "to": {
          "height": "var(--radix-accordion-content-height)",
        },
      },
      "accordion-up": {
        "from": {
          "height": "var(--radix-accordion-content-height)",
        },
        "to": {
          "height": "0",
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
