module.exports = {
  root: true,
  env: {
    browser: true
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-essential',
    'plugin:@typescript-eslint/recommended'
  ],
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-extra-semi': 'error',
    semi: [2, 'never'],
    'no-undef': 'off',
    quotes: ['error', 'single'],
    'vue/no-v-model-argument': 'off',
    'object-curly-spacing': ['error', 'always'],
    'template-curly-spacing': 'error',
    'space-infix-ops': 'error',
    'space-before-blocks': 'error',
    'react-native/no-inline-styles': 'off',
    'react-hooks/exhaustive-deps': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'vue/no-mutating-props': 'warn'
  }

}
