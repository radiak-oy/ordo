// eslint-disable-next-line
const a11yOff = Object.keys(require('eslint-plugin-jsx-a11y').rules).reduce(
  (acc, rule) => {
    acc[`jsx-a11y/${rule}`] = 'off';
    return acc;
  },
  {}
);

module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'plugin:react/recommended',
    'airbnb',
    'airbnb-typescript',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:prettier/recommended',
  ],
  overrides: [],
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
  },
  plugins: ['@typescript-eslint', 'react', 'prettier'],
  rules: {
    // allows async functions to be event handlers
    // ie. onClick={handleClick}
    '@typescript-eslint/no-misused-promises': [
      'error',
      { checksVoidReturn: { attributes: false } },
    ],
    // allows to explicitly mark promises as ignored
    'no-void': ['error', { allowAsStatement: true }],
    ...a11yOff,
  },
};
