module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: __dirname,
    sourceType: 'module',
     extraFileExtensions: [".json"]
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'eslint:recommended', // 使用 ESLint 默认推荐的规则
    'plugin:prettier/recommended', // 启用 Prettier 的 ESLint 插件
    'plugin:@typescript-eslint/recommended', // 如果你使用 TypeScript
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'prettier/prettier': ['error', { endOfLine: 'off' }], //不让prettier检测文件每行结束的格式
  },
}
