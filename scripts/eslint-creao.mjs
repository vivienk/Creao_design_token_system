import { readFileSync } from 'node:fs';
const mapping = JSON.parse(readFileSync(new URL('../design/generated/token-map.json', import.meta.url)));
const known = new Set([...mapping.tokens.map(t => t.cssName), ...Object.keys(mapping.darkOnly)]);
const dimensions = /^(padding|margin|gap|rowGap|columnGap|borderRadius|fontSize|lineHeight|fontFamily|fontWeight|letterSpacing)(Top|Right|Bottom|Left|Inline|Block|Start|End)?$/;
const colors = /^(color|background|backgroundColor|borderColor|outlineColor|fill|stroke|boxShadow|textShadow)$/;
const exemptions = new Set(['inherit', 'initial', 'unset', 'revert', 'auto', 'normal', 'none', 'transparent', 'currentColor']);

export default { rules: { 'existing-tokens': {
  meta: { type: 'problem', schema: [], messages: {
    unknown: 'Unknown Creao token {{name}}. Use the pinned source registry.',
    literal: 'Use an existing Creao token for {{name}}; spacing uses calc(var(--spacing) * integer).',
    foreign: 'Do not introduce Atlaskit runtime tokens into Creao. Use existing CSS variables.',
  } },
  create(context) {
    function checkReferences(node, value) {
      for (const match of value.matchAll(/var\(\s*(--[\w-]+)/g)) {
        if (!known.has(match[1])) context.report({ node, messageId: 'unknown', data: { name: match[1] } });
      }
    }
    return {
      ImportDeclaration(node) {
        if (node.source.value === '@atlaskit/tokens') context.report({ node, messageId: 'foreign' });
      },
      Literal(node) { if (typeof node.value === 'string') checkReferences(node, node.value); },
      TemplateElement(node) { checkReferences(node, node.value.raw); },
      Property(node) {
        const name = node.computed ? node.key.value : (node.key.name ?? node.key.value);
        if (typeof name !== 'string' || !(dimensions.test(name) || colors.test(name))) return;
        const value = node.value.type === 'Literal' ? node.value.value :
          node.value.type === 'TemplateLiteral' && !node.value.expressions.length ? node.value.quasis[0].value.cooked : undefined;
        // Dynamic expressions require review; this rule does not pretend to evaluate runtime values.
        if (value === undefined) return;
        const text = String(value).trim();
        if (value === 0 || text === '0' || exemptions.has(text)) return;
        const refs = [...text.matchAll(/var\(\s*(--[\w-]+)\s*\)/g)];
        let valid = refs.length > 0 && refs.every(m => known.has(m[1]));
        if (/^(padding|margin|gap|rowGap|columnGap)/.test(name)) {
          valid = /^(?:var\(--spacing\)|calc\(var\(--spacing\) \* -?\d+\)|0)(?:\s+(?:var\(--spacing\)|calc\(var\(--spacing\) \* -?\d+\)|0))*$/.test(text);
        } else {
          // No raw fallback values or literal segments alongside a token.
          valid = valid && text.replace(/var\(\s*--[\w-]+\s*\)/g, '').trim() === '';
        }
        if (!valid) context.report({ node: node.value, messageId: 'literal', data: { name } });
      },
    };
  },
} } };
