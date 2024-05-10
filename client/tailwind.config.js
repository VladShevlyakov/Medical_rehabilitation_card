import flowbite from "flowbite-react/tailwind";

/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
    content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}", flowbite.content()],
    theme: {
        colors: {
            "bg-head": "#39AA9D",
            "bg-foot-start": "#58bdc4 0%",
            "bg-foot-end": "#3eb3a5 100%",
            "bg-dash-sidebar": "#58bdc4",
        },
        extend: {},
    },
    plugins: [flowbite.plugin(), "tailwind-scrollbar"],
};
