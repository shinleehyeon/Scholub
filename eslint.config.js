import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

export default [
  ...compat.extends("plugin:@typescript-eslint/recommended", "prettier"),
  {
    ignores: ["dist/**"],
  },
  {
    files: ["**/*.{ts,tsx}"],
    plugins: {
      "@typescript-eslint": (await import("typescript-eslint")).default.plugin,
      prettier: (await import("eslint-plugin-prettier")).default,
    },
    languageOptions: {
      parser: (await import("typescript-eslint")).default.parser,
    },
    rules: {
      "no-undef": "off",
      "prettier/prettier": "error",
      "@typescript-eslint/no-explicit-any": "off",
      "no-unused-vars": "warn",
    },
  },
];
