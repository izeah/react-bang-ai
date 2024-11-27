/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{html,js,ts,jsx,tsx}"],
    theme: {
        fontFamily: {
            sans: ["SF Pro Display", "sans-serif"],
            serif: ["New York", "serif"],
        },
        extend: {
            spacing: {
                "8xl": "96rem",
                "9xl": "128rem",
            },
            borderRadius: {
                "4xl": "2rem",
            },
        },
    },
    plugins: [require("@tailwindcss/typography")],
};
