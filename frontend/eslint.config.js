// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import tseslint from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import reactPlugin from "eslint-plugin-react";
import hooksPlugin from "eslint-plugin-react-hooks";
// import jsxA11yPlugin from "eslint-plugin-jsx-a11y"; // Not explicitly listed in package.json, but often part of react-app

export default [
  {
    // Global ignores - node_modules is ignored by default
    ignores: ["build/", ".vscode/", ".github/"],
  },
  {
    // Configuration for JavaScript and TypeScript files
    files: ["src/**/*.{js,jsx,ts,tsx}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        ecmaVersion: "latest",
        sourceType: "module",
        project: "./tsconfig.json", // Important for some TypeScript rules
      },
      globals: {
        ...globals.browser,
        ...globals.es2021,
        ...globals.node, // For completeness, though browser is primary
      },
    },
    // Plugins are typically objects in flat config, but older plugins might need different handling
    // This is a potential area for issues if plugins don't export what's expected.
    plugins: {
      "@typescript-eslint": tseslint,
      react: reactPlugin,
      "react-hooks": hooksPlugin,
      // "jsx-a11y": jsxA11yPlugin,
    },
    rules: {
      // Start with recommended rules
      ...js.configs.recommended.rules,
      ...(tseslint.configs.recommended ? tseslint.configs.recommended.rules : {}), // or .configs["recommended-type-checked"]
      ...(reactPlugin.configs.recommended ? reactPlugin.configs.recommended.rules : {}),
      // React specific rules (some might be in recommended)
      "react/jsx-uses-react": "off", // Not needed with React 17+ new JSX transform
      "react/react-in-jsx-scope": "off", // Not needed with React 17+
      "react/prop-types": "off", // Typically handled by TypeScript
      // Hooks rules
      ...(hooksPlugin.configs.recommended ? hooksPlugin.configs.recommended.rules : {}),
      // JSX A11y rules (if plugin was added)
      // ...(jsxA11yPlugin.configs.recommended ? jsxA11yPlugin.configs.recommended.rules : {}),

      // Custom rules or overrides from react-app (this is a simplification)
      "no-unused-vars": ["warn", {
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-unused-vars": ["error", { // Changed from default error to allow underscore patterns
        "argsIgnorePattern": "^_",
        "varsIgnorePattern": "^_",
        "caughtErrorsIgnorePattern": "^_"
      }],
      "@typescript-eslint/no-explicit-any": "warn", // Changed from error to warn
      // Example: from eslint-config-react-app (actual config is more complex)
      "no-console": "warn",
      "eqeqeq": ["warn", "always", {"null": "ignore"}],
    },
    settings: {
      react: {
        version: "detect", // Automatically detect the React version
      },
    },
  },
  {
    // Configuration for Jest test files (if any, typically .test.js/ts or in __tests__)
    // This part would replicate "react-app/jest"
    // files: ["src/**/*.test.{js,jsx,ts,tsx}"],
    // languageOptions: {
    //   globals: {
    //     ...globals.jest,
    //   },
    // },
    // plugins: {
    //   // jestPlugin: (import jestPlugin from 'eslint-plugin-jest') // if jest plugin is installed
    // },
    // rules: {
    //   // ...jestPlugin.configs.recommended.rules,
    // },
  }
];
