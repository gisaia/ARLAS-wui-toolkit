import { defineConfig, globalIgnores } from "eslint/config";
import typescriptEslint from "@typescript-eslint/eslint-plugin";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import stylistic from '@stylistic/eslint-plugin'

export default defineConfig([globalIgnores(["**/node_modules", "**/dist", "eslint.config.mjs", "test/app.js","test/webpack.config.js"]), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        "@stylistic": stylistic
    },

    languageOptions: {
        globals: {
            ...globals.browser,
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 5,
        sourceType: "module",

        parserOptions: {
            project: "tsconfig.json",
        },
    },
    files:["projects/**/*.ts"],
    rules: {
        "@typescript-eslint/consistent-type-definitions": "error",
        "@typescript-eslint/dot-notation": "off",

        "@typescript-eslint/explicit-member-accessibility": ["error", {
            accessibility: "explicit",
        }],

        "@stylistic/member-delimiter-style": ["error", {
            multiline: {
                delimiter: "semi",
                requireLast: true,
            },

            singleline: {
                delimiter: "semi",
                requireLast: true,
            },
        }],

        "@typescript-eslint/member-ordering": 0,

        "@typescript-eslint/naming-convention": ["error", {
            selector: "variable",
            format: ["camelCase", "UPPER_CASE"],
        }],

        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/no-empty-interface": "error",

        "@typescript-eslint/no-inferrable-types": ["error", {
            ignoreParameters: true,
        }],

        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-non-null-assertion": "error",

        "@typescript-eslint/no-shadow": ["off", {
            hoist: "all",
        }],

        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/prefer-function-type": "error",

        "@/quotes": [2, "single", {
            avoidEscape: true,
            allowTemplateLiterals: true,
        }],

        "@/semi": ["error"],
        "@stylistic/type-annotation-spacing": "error",
        "@typescript-eslint/unified-signatures": "error",
        "arrow-body-style": "error",
        "brace-style": ["error", "1tbs"],
        "constructor-super": "error",
        curly: "error",
        "dot-notation": "off",
        "eol-last": "error",
        eqeqeq: ["error", "smart"],
        "guard-for-in": "error",
        "id-denylist": "off",
        "id-match": "off",

        "max-len": ["error", {
            code: 146,
        }],

        "no-bitwise": "off",
        "no-caller": "error",

        "no-console": ["error", {
            allow: [
                "log",
                "warn",
                "dir",
                "timeLog",
                "assert",
                "clear",
                "count",
                "countReset",
                "group",
                "groupEnd",
                "table",
                "dirxml",
                "error",
                "groupCollapsed",
                "Console",
                "profile",
                "profileEnd",
                "timeStamp",
                "context",
            ],
        }],

        "no-debugger": "error",
        "no-empty": "off",
        "no-empty-function": "off",
        "no-eval": "error",
        "no-fallthrough": "error",
        "no-new-wrappers": "error",
        "no-restricted-imports": "error",
        "no-shadow": "off",
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "off",
        "no-unused-expressions": "error",
        "no-unused-labels": "error",
        "no-var": "error",
        "prefer-const": "error",
        radix: "error",
        semi: "error",

        "spaced-comment": ["error", "always", {
            markers: ["/"],
        }],
    },
}]);
