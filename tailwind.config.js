/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        text: "var(--text)",
        muted: "var(--muted)",
        line: "var(--line)",
        accent: "var(--accent)",
        "accent-soft": "var(--accent-soft)",
      },
      fontFamily: {
        display: ["var(--font-syne)"],
        sans: ["var(--font-dm-sans)"],
        mono: ["var(--font-dm-mono)"],
      },
    },
  },
};
