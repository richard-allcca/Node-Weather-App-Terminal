module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  // extends: ['airbnb-base'],
  extends: ['eslint:recommended'], // Usa la configuración recomendada de ESLint
  parserOptions: {
    ecmaVersion: 12, // Permite el uso de características de ES2021
  },
  rules: {
    'linebreak-style': [
      'error',
      process.platform === 'win32' ? 'windows' : 'unix',
    ],
    // semi: ['error', 'never'],
    semi: 'error',
    'no-param-reassign': ['error', { props: false }],
    'no-unused-vars': 'warn', // Advertencia para variables no utilizadas
    'no-undef': 'warn', // Advertencia para variables no definidas
    'no-console': 'off',
    'no-await-in-loop': 'off',
    'no-plusplus': 'off',
    'arrow-body-style': 'off',
  },
};
