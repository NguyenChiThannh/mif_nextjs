module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier', // 🗝 tránh conflict với Prettier
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint'],
};
