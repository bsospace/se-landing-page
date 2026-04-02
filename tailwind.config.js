/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./data/*.json"
  ],
  theme: {
    extend: {
      borderRadius: {
        sm: "0.625rem",
        md: "0.75rem",
        lg: "1rem",
        xl: "1.5rem",
      },
      boxShadow: {
        card: "0 1px 2px rgba(15, 23, 42, 0.06)",
        "card-hover": "0 14px 28px -12px rgba(15, 23, 42, 0.22)",
        focus: "0 0 0 4px rgba(220, 38, 38, 0.25)",
      },
      transitionDuration: {
        fast: "180ms",
        base: "280ms",
      },
      transitionTimingFunction: {
        standard: "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      spacing: {
        18: "4.5rem",
      },
    },
  },
  plugins: [],
}
