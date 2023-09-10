module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint', 'perfectionist'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
    'plugin:perfectionist/recommended-natural',
  ],
  rules: {
    'perfectionist/sort-array-includes': 'off',
    'perfectionist/sort-classes': 'off',
    'perfectionist/sort-enums': 'off',
    'perfectionist/sort-interfaces': 'off',
    'perfectionist/sort-object-types': 'off',
    'perfectionist/sort-objects': 'off',
  },
};
