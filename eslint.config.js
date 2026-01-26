const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  {
    ignores: [
      "dist/**",
      ".next/**",
      "node_modules/**",
      "src/legacy_pages/**",
      "src/App.tsx",
      "src/main.tsx",
      "src/layouts/**",
      "src/components/NavLink.tsx",
      "src/components/GlobalSearch.tsx",
      "src/components/auth/**",
    ],
  },
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
