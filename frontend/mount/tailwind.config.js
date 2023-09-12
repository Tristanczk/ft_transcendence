/** @type {import('tailwindcss').Config} */

module.exports = {
    content: [
        './src/**/*.{js,jsx,ts,tsx}',
        'node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}',
    ],
    theme: {
        extend: {
            width: {
                '104': '26rem',
                '144': '36rem',
            },
            fontFamily: {
                'pressStart': ['"Press Start 2P"', 'ui-sans-serif'],
                'josefin': ['"Josefin Sans"', 'ui-sans-serif']
            },
        },
    },
    plugins: [require('flowbite/plugin')],
};
