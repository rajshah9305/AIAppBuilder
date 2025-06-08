// eslint.config.js
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    // Applies to all JS/MJS/CJS files by default
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node, // For Node.js environment
        ...globals.es2021, // Or a more specific ES version if es6 is too broad with 'latest'
        ...globals.jest,  // For Jest testing environment
      }
    },
    rules: {
      // Start with recommended rules
      ...js.configs.recommended.rules,
      // Override/add specific rules
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }]
    }
  }
  // You can add more configuration objects for specific file types/directories
  // For example, if you had TypeScript files:
  // {
  //   files: ["**/*.ts", "**/*.tsx"],
  //   languageOptions: { /* ... typescript specific ... */ },
  //   rules: { /* ... typescript specific rules ... */ }
  // }
];
