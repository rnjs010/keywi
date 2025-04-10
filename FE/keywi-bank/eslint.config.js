import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default tseslint.config(
  { ignores: ["**/*", "!src", "!src/"] }, // .prettierignore 과 동일하게 설정
  {
    extends: [
      js.configs.recommended,
      ...tseslint.configs.recommended,
      prettierConfig, // Prettier 설정 추가 (충돌 방지)
    ],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
      prettier: prettierPlugin, // Prettier 플러그인 추가
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "prettier/prettier": "error", // Prettier 규칙을 ESLint에서 에러로 표시
    },
  }
);
