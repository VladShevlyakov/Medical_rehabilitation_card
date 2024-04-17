import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
    theme: {
        colors: {
            "bg-head": "#39AA9D",
        },
        extend: {},
    },
    plugins: [flowbite.plugin()],
};
