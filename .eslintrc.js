// eslint-disable-next-line import/no-commonjs
module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true
  },
  extends: [
    'airbnb',
    'plugin:react/recommended',
    'standard-with-typescript'
  ],

  plugins: ['react', 'import', 'jsx-a11y'],
  overrides: [],
  parserOptions: {
    project: './tsconfig.json',
    ecmaVersion: 'latest',
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.jsx', '.ts', '.tsx']
      }
    }
  },
  rules: {
    'brace-style': ['error', '1tbs'],
    'no-tabs': 0,
    semi: ['error', 'always'],
    '@typescript-eslint/semi': ['error', 'always'],
    'global-require': 0,
    'max-len': [
      'warn',
      {
        code: 120,
        tabWidth: 2,
        comments: 200,
        ignoreComments: false,
        ignoreTrailingComments: true,
        ignoreUrls: true,
        ignoreStrings: true,
        ignoreTemplateLiterals: true,
        ignoreRegExpLiterals: true
      }
    ],
    'no-unused-expressions': 'off',
    'import/prefer-default-export': 'off',
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'internal',
          'external',
          'object',
          'type',
          'parent',
          'sibling',
          'index'
        ],
        alphabetize: {
          order: 'asc',
          caseInsensitive: true
        },
        'newlines-between': 'always',
        pathGroups: [
          {
            pattern: '@yellowclass/**',
            group: 'external',
            position: 'after'
          }
        ],
        pathGroupsExcludedImportTypes: ['builtin']
      }
    ],
    'import/first': 1,
    'import/no-namespace': 1,
    'react/prop-types': 0,
    'react/no-unescaped-entities': 'off',
    'import/extensions': 'off',
    'import/no-useless-path-segments': [
      'error',
      {
        noUselessIndex: true
      }
    ],
    'import/no-deprecated': 1,
    'import/no-commonjs': ['error'],
    'import/no-default-export': ['error'],
    'import/no-unassigned-import': [
      'error',
      { allow: ['dotenv-safe/config', 'newrelic'] }
    ],
    'import/no-duplicates': ['error'],
    'import/no-cycle': ['error'],
    eqeqeq: ['error', 'always'],
    'max-params': ['error', 4],
    'no-console': ['error'],
    'no-lonely-if': ['error'],
    'no-useless-return': ['error'],
    'spaced-comment': ['error', 'always'],
    yoda: ['error', 'never'],
    'jsx-a11y/href-no-hash': ['off'],
    'react/jsx-filename-extension': [
      'warn',
      { extensions: ['.js', '.jsx', '.ts', '.tsx'] }
    ],
    'dot-notation': 'off',
    'no-use-before-define': 'off',
    'no-param-reassign': [2, { props: false }],
    'consistent-return': 'off',
    'jsx-a11y/media-has-caption': 'off',
    'jsx-a11y/label-has-associated-control': 'off',
    'react/jsx-props-no-spreading': 'off',
    'react/require-default-props': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: ['**/*.test.ts', '**/*.test.tsx', 'jest.setup.ts'] }
    ],
    'no-return-await': 'off',
    '@typescript-eslint/strict-boolean-expressions': 'off',
  }
};
