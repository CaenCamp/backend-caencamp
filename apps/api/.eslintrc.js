module.exports = {
    env: {
        node: true,
        browser: false,
        es2020: true,
        'jest/globals': true,
    },
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    plugins: ['prettier', 'jest'],
    extends: ['eslint:recommended', 'prettier', 'plugin:prettier/recommended'],
    rules: {
        'no-console': [
            'error',
            {
                allow: ['warn', 'error'],
            },
        ],
        'no-unused-vars': [
            'error',
            {
                ignoreRestSiblings: true,
            },
        ],
        'no-irregular-whitespace': [
            'error',
            {
                skipStrings: true,
                skipComments: false,
                skipRegExps: true,
                skipTemplates: true,
            },
        ],
        'prettier/prettier': 'error',
    },
};
