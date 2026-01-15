import { FlatCompat } from "@eslint/eslintrc";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: [
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "node_modules/**",
      "**/__tests__/**",
      "**/*.test.ts",
      "**/*.test.tsx",
      "jest.config.js",
      "scripts/**",
      "playwright.config.ts",
      "e2e/**",
    ],
  },
  ...compat.extends("next/core-web-vitals"),
  ...compat.extends("next/typescript"),
  {
    files: ["src/lib/json-diff/**/*.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "warn",
    },
  },
  {
    files: ["src/data/**/*.ts", "src/data/**/*.tsx"],
    rules: {
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/no-explicit-any": "off",
    },
  },
  {
    files: ["src/components/tools/json-diff/**/*.tsx", "src/hooks/useDiff.ts"],
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];

export default eslintConfig;
