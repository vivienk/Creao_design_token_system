import atlassian from '@atlaskit/eslint-plugin-design-system';
import parser from '@typescript-eslint/parser';
import creao from './scripts/eslint-creao.mjs';

// Retain Atlassian detection, but suppress fixes/suggestions that mint Atlaskit tokens.
const upstream = atlassian.rules['ensure-design-token-usage'];
const detectionOnly = {
  ...upstream,
  meta: { ...upstream.meta, fixable: undefined, hasSuggestions: false },
  create(context) {
    const safe = Object.create(context);
    Object.defineProperty(safe, 'report', { value(descriptor) {
      const { fix, suggest, ...diagnostic } = descriptor;
      context.report(diagnostic);
    } });
    return upstream.create(safe);
  },
};

export default [
  { ignores: ['node_modules/**', 'design/**'] },
  {
    files: ['{src,app,components}/**/*.{js,jsx,ts,tsx}'],
    languageOptions: { parser, parserOptions: { ecmaVersion: 'latest', sourceType: 'module', ecmaFeatures: { jsx: true } } },
    linterOptions: { noInlineConfig: true, reportUnusedDisableDirectives: 'error' },
    plugins: {
      '@atlaskit/design-system': { rules: { 'ensure-design-token-usage': detectionOnly } },
      creao,
    },
    rules: {
      '@atlaskit/design-system/ensure-design-token-usage': ['error', { domains: ['color'], applyImport: false, shouldEnforceFallbacks: false }],
      'creao/existing-tokens': 'error',
    },
  },
];
