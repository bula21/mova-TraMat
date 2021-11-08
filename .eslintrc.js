module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    "plugin:vue/essential",
    "@vue/typescript/recommended",
    '@vue/airbnb',
  ],
  parserOptions: {
    ecmaVersion: 2020,
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
    "prefer-destructuring": ["error", { "object": true, "array": false }],
    "lines-between-class-members": ["error", "always", { "exceptAfterSingleLine": true }],
    "object-curly-newline": ["error", {
      "ObjectExpression": "always",
      "ObjectPattern": { "multiline": true },
      "ImportDeclaration": "never",
      "ExportDeclaration": { "multiline": true, "minProperties": 3 }
    }],
    "max-len": ["error", { "code": 1000 }],
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off"
  }
};
