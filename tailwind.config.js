/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
    theme: {
        extend: {
            colors: {
                customGreen: "hsl(165, 83%, 35%)",
                customLightGreen: "hsl(166, 39%, 89%)",
                customAccentYellow: "hsl(40, 99%, 66%)",
                customAccentMaroon: "hsl(360, 83%, 70%)",
                customNeutral: "hsl(0, 0%, 96%)",
            },
        },
    },
    plugins: [],
};
