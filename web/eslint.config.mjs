import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import pluginReactConfig from "eslint-plugin-react/configs/recommended.js";

export default [
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReactConfig,
  {
    rules: {
      "react/require-render-return": "off",
      "react/display-name": "off",
      "react/no-direct-mutation-state": "off",
      "react/no-string-refs": "off",
      "react/prop-types": "off",
      "react/jsx-no-undef": "off",
      "react/jsx-uses-react": "off",
      "react/jsx-uses-vars": "off",
      "react/react-in-jsx-scope": "off",
      "react/no-danger-with-children": "off",
      "no-console": 2,
    },
  },
];
