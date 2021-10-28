module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/essential",
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-recommended",
    "@vue/standard",
    "@vue/typescript/recommended"
  ],
  parserOptions: {
    ecmaVersion: 2020,
    parser: "@typescript-eslint/parser",
    sourceType: "module"
  },
  plugins: [
    "vue",
    "@typescript-eslint"
  ],
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
    "space-before-function-paren": ["error", {
      anonymous: "always",
      named: "never",
      asyncArrow: "always"
    }],
    "vue/script-indent": ["error", 2],
    indent: ["error", 2, { SwitchCase: 1 }],
    "no-trailing-spaces": [2, { skipBlankLines: true }],
    "no-multiple-empty-lines": ["error", { max: 10, maxBOF: 2, maxEOF: 0 }],
    "no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
    "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
};
