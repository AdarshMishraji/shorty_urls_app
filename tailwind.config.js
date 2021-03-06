module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: "class", // or 'media' or 'class'
    theme: {
        extend: {
            spacing: {
                100: "27.5rem",
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
