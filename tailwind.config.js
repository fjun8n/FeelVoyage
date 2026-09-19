/** Configurația Tailwind — folosită doar la generarea css/tailwind.css (vezi README.md) */
module.exports = {
    content: ['./index.html', './js/**/*.js'],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f7ff',
                    100: '#e0effe',
                    500: '#0284c7',
                    600: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                },
                sunset: {
                    400: '#fb7185',
                    500: '#f43f5e',
                    600: '#e11d48',
                    gold: '#f59e0b',
                }
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'sans-serif'],
                serif: ['"Volkhov"', 'serif'],
            }
        }
    }
};
