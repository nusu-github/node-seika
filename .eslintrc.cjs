module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
    },
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        tsconfigRootDir: __dirname,
        project: ["./tsconfig.json"],
    },
    plugins: ["import", "@typescript-eslint", "unicorn"],
    extends: [
        "plugin:import/recommended",
        "plugin:import/typescript",
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "plugin:@typescript-eslint/strict",
        "plugin:unicorn/all",
        "prettier",
    ],
    rules: {
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/require-array-sort-compare": "off",
        "unicorn/filename-case": [
            "error",
            {
                case: "snakeCase",
            },
        ],
        "import/order": [
            "error",
            {
                groups: [
                    "builtin",
                    "index",
                    "sibling",
                    "parent",
                    "internal",
                    "external",
                    "object",
                    "type",
                ],
                "newlines-between": "always",
            },
        ],
        "import/no-unresolved": [
            "error",
            {
                ignore: [".js"],
            },
        ],
    },
    ignorePatterns: [".eslintrc.*", "node_modules", "dist"],
};
