/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    {
      pattern: /(bg|text|border|shadow|accent|from|to)-(red|orange|yellow|pink|cyan|blue|purple|green|emerald|indigo|teal)-(200|300|400|500|600|700|900)/,
      variants: ['hover', 'focus', 'group-hover', 'active'],
    },
    // Pattern for opacity modifiers specifically for bg and border which are commonly used with opacity
    {
      pattern: /(bg|border|text)-(red|orange|yellow|pink|cyan|blue|purple|green|emerald|indigo|teal)-(200|400|500|600|700|900)\/(5|10|20|30|50|70|80|90)/,
      variants: ['hover', 'focus', 'group-hover'],
    }
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
