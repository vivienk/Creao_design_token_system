import test from 'node:test';
import assert from 'node:assert/strict';
import { ESLint } from 'eslint';
const eslint = new ESLint();
async function lint(code, fix = false) {
  const engine = fix ? new ESLint({ fix: true }) : eslint;
  return (await engine.lintText(code, { filePath: 'src/guardrail.tsx' }))[0];
}
test('existing Creao color/type/spacing variables pass', async () => {
  const r = await lint(`export const View = () => <div style={{color:'var(--color-foreground)', backgroundColor:'var(--color-surface)', padding:'calc(var(--spacing) * 4)', fontSize:'var(--text-base)'}} />;`);
  assert.equal(r.errorCount, 0, JSON.stringify(r.messages));
});
test('Atlassian rule catches raw CSS-in-JS color', async () => {
  const r = await lint(`import { css } from '@emotion/react'; const styles = css({color:'#ffffff'});`);
  assert.ok(r.messages.some(m => m.ruleId === '@atlaskit/design-system/ensure-design-token-usage'));
});
test('raw spacing, typography and unknown variables fail', async () => {
  const r = await lint(`const View = () => <div style={{padding:14,fontSize:16,color:'var(--invented)'}} />;`);
  assert.ok(r.messages.some(m => m.message.includes('padding')));
  assert.ok(r.messages.some(m => m.message.includes('fontSize')));
  assert.ok(r.messages.some(m => m.message.includes('--invented')));
});
test('raw fallback and fractional spacing multiplier fail', async () => {
  const r = await lint(`const View = () => <div style={{color:'var(--color-foreground, #fff)',gap:'calc(var(--spacing) * 3.5)'}} />;`);
  assert.ok(r.errorCount >= 2);
});
test('autofix cannot insert Atlaskit tokens', async () => {
  const r = await lint(`import { css } from '@emotion/react'; const styles = css({color:'#ffffff'});`, true);
  assert.equal(r.output, undefined);
  assert.ok(r.errorCount > 0);
});
test('inline suppression and Atlaskit runtime migration are blocked', async () => {
  const r = await lint(`/* eslint-disable */\nimport {token} from '@atlaskit/tokens'; const View = () => <div style={{padding:14}}/>;`);
  assert.ok(r.messages.some(m => m.ruleId === 'creao/existing-tokens' && m.message.includes('runtime')));
  assert.ok(r.messages.some(m => m.message.includes('padding')));
});
test('known tokens used in wrong property domains fail', async () => {
  const r = await lint(`const View=()=> <div style={{color:'var(--spacing)',fontSize:'var(--color-foreground)',borderRadius:'var(--text-base)'}}/>;`);
  assert.equal(r.messages.filter(m => m.messageId === 'domain').length, 3);
});
test('primitive color bypass and corner radius literals fail', async () => {
  const r = await lint(`const View=()=> <div style={{color:'var(--color-grey-500)',borderTopLeftRadius:14,borderStartStartRadius:14}}/>;`);
  assert.ok(r.messages.some(m => m.messageId === 'domain'));
  assert.equal(r.messages.filter(m => m.messageId === 'literal').length, 2);
});
test('approved role domains and corner radius tokens pass', async () => {
  const r = await lint(`const View=()=> <div style={{color:'var(--color-foreground)',borderTopLeftRadius:'var(--radius-md)',fontFamily:'var(--font-sans)',fontWeight:'var(--font-weight-medium)',lineHeight:'var(--text-base--line-height)',letterSpacing:'var(--tracking-normal)'}}/>;`);
  assert.equal(r.errorCount, 0, JSON.stringify(r.messages));
});
