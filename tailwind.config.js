/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/flowbite-react/**/*.js",
    "./pages/**/*.{js,ts,tsx}",
    "./public/**/*.html",
	// "./pages/dataCapture/index.js",
  ],
  plugins: [require("flowbite/plugin")],
  theme: {},
};
