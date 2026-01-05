import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
                heading: ['var(--font-inter)', 'system-ui', 'sans-serif'],
            },
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: '#1A4731', // Moss Green
                    50: '#f2f7f4',
                    100: '#e1ede6',
                    200: '#c5dcd0',
                    300: '#9dbfae',
                    400: '#729d88',
                    500: '#4f7f68',
                    600: '#3a6350',
                    700: '#2f5041',
                    800: '#284136',
                    900: '#1A4731', // Moss Deep
                    950: '#12261c',
                },
                secondary: {
                    DEFAULT: '#F4F4F0', // Bone/Off-white
                    foreground: '#1A4731',
                },
                accent: {
                    DEFAULT: '#BCB8B1', // Earth
                    foreground: '#000000',
                },
                moss: {
                    DEFAULT: '#1A4731',
                    light: '#2A5C41',
                    dark: '#0F2E1F',
                },
                bone: '#F4F4F0',
                earth: '#BCB8B1',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
    plugins: [],
};
export default config;
