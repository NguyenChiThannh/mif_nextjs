module.exports = {
  root: true,
  env: { browser: true, es2021: true },
  extends: [
    'next',
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['react', '@typescript-eslint', 'unused-imports', 'prettier'],
  rules: {
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': 'off',
    'object-curly-newline': [
      'error',
      {
        ObjectExpression: { multiline: true, minProperties: 2 },
        ObjectPattern: { multiline: true, minProperties: 2 },
        ImportDeclaration: { multiline: true, minProperties: 2 },
        ExportDeclaration: { multiline: true, minProperties: 2 },
      },
    ],
  },
}
