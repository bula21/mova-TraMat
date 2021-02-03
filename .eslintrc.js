/* eslint-disable no-dupe-keys */
module.exports = {
    "env": [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:@typescript-eslint/recommended",
        "@vue/standard",
        "@vue/typescript/recommended"
    ],

    "extends": [
        "eslint:recommended",
        "plugin:vue/essential",
        "plugin:@typescript-eslint/recommended",
        "plugin:vue/vue3-recommended"
    ],

    "parserOptions": {
        "ecmaVersion": 12,
        "parser": "@typescript-eslint/parser",
        "sourceType": "module"
    },

    "plugins": [
        "vue",
        "@typescript-eslint"
    ],

    "rules": {
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "warn",
            "double"
        ],
        "semi": [
            "error",
            "always"
        ]
    },

    root: true,

    env: {
        browser: true,
        es2021: true,
        node: true
    },

    parserOptions: {
        ecmaVersion: 2020,
        parser: "@typescript-eslint/parser",
        sourceType: "module"
    },

    rules: {
        "linebreak-style": [
            "error",
            "unix"
        ],
        quotes: [
            "warn",
            "double"
        ],
        semi: [
            "error",
            "always"
        ],
        "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
        "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
    }
};
