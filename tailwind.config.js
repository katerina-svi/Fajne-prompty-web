/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                blue: {
                    50: '#eff6ff',
                    700: '#1e40af',
                },
                purple: {
                    700: '#7c3aed',
                },
                pink: {
                    700: '#db2777',
                },
                green: {
                    700: '#15803d',
                },
                red: {
                    700: '#b91c1c',
                },
                gray: {
                    50: '#f9fafb',
                    300: '#d1d5db',
                    600: '#4b5563',
                    700: '#374151',
                    900: '#111827',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
