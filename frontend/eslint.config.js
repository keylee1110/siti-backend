const { FlatCompat } = require("@eslint/eslintrc");
const js = require("@eslint/js");
const globals = require("globals");
const tseslint = require("@typescript-eslint/eslint-plugin");
const tsParser = require("@typescript-eslint/parser");

const compat = new FlatCompat({
    baseDirectory: __dirname,
});

module.exports = [
    // Global ignores
    {
        ignores: [".next/", "node_modules/"],
    },

    // Base config for all JS/TS files
    {
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        settings: { // Keep react version detection
            react: {
                version: "detect",
            },
        },
    },

    // TypeScript specific config
    {
        files: ["**/*.{ts,tsx}"],
        plugins: {
            "@typescript-eslint": tseslint,
        },
        languageOptions: {
            parser: tsParser,
            parserOptions: {
                project: true,
            },
        },
        rules: {
            // Turn off base no-unused-vars and use the TS version
            "no-unused-vars": "off",
            "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }],
        },
    },

    // Next.js legacy config (using compat)
    // This provides the react, react-hooks, and next plugins and rules
    ...compat.extends("next/core-web-vitals"),
];