module.exports = {
  env: {
    node: true,
    commonjs: true,
    es2021: true,
    jest: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "no-console": "off", // Allow console.log for server logging
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "prefer-const": "error",
    "no-var": "error",
    "object-shorthand": "warn",
    "quote-props": ["warn", "as-needed"],
  },
  ignorePatterns: ["node_modules/", "dist/", "build/", "coverage/"],
};
