/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: false,
    sourceType: "module",
    ecmaVersion: 2021,
  },
  plugins: ["@typescript-eslint"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
  ],
  ignorePatterns: ["dist/", "node_modules/", "prisma/dev.db"],
  rules: {
    // 可以根据团队习惯在此处细化规则
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};

