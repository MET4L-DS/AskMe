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
                customNeutral: "hsl(0, 0%, 94%)",
                customGray: "hsl(0, 0%, 67%)",
                customDark100: "hsl(228, 11%, 57%)",
                customDark200: "hsl(225, 10%, 33%)",
                customDark300: "hsl(225, 9%, 27%)",
                customDark400: "hsl(228, 6%, 17%)",
                customDark500: "hsl(228, 8%, 13%)",
            },
        },
    },
    plugins: [],
};
