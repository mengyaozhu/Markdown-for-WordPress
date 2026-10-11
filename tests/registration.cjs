/* API-contract integration harness: node tests/registration.cjs.
 * Uses expected WordPress globals, not a live WordPress browser. */
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const common = fs.readFileSync(path.join(__dirname, '../plugin/markdown-for-wordpress/assets/markdown.js'), 'utf8');
const source = fs.readFileSync(path.join(__dirname, '../plugin/markdown-for-wordpress/assets/editor.js'), 'utf8');
const fixture = fs.readFileSync(path.join(__dirname, 'fixtures/sample.md'), 'utf8');
function setup({ legacy = false, missing = false, panel = true } = {}) {
  let ready, registration, count = 0, cursor = 0, blocks, title;
  const states = [], errors = [];
  const components = Object.fromEntries(['Button', 'Modal', 'TextareaControl', 'CheckboxControl', 'Notice'].map(x => [x, x]));
  const api = { PluginMoreMenuItem: 'Menu', ...(panel ? {PluginDocumentSettingPanel: 'Panel'} : {}) };
  const wp = {
    domReady: cb => {ready = cb;},
    element: { Fragment: 'Fragment', createElement: (type, props, ...children) => {
      assert.ok(type, 'Never render an undefined component'); return {type, props: props || {}, children};
    }, useState: initial => { const index = cursor++; if (!(index in states)) states[index] = initial;
      return [states[index], value => {states[index] = value;}]; } },
    components,
    plugins: {registerPlugin: (name, args) => {assert.equal(name, 'markdown-for-wordpress'); registration = args; count++;}, getPlugin: () => registration},
    blocks: {createBlock: (name, attrs = {}, innerBlocks = []) => ({name, attributes: attrs, innerBlocks})},
    data: { dispatch: store => store === 'core/block-editor' ? {resetBlocks: value => {blocks = value;}} : {editPost: value => {title = value.title;}} },
    ...(legacy ? {editPost: api} : {editor: api})
  };
  if (missing) delete wp.plugins;
  vm.runInNewContext(common + '\n' + source, {window: {wp}, console: {error: value => errors.push(value)}});
  assert.equal(count, 0, 'Must wait for wp.domReady');
  function render() {cursor = 0; return registration.render();}
  return {ready: () => ready(), render, wp, errors, states, get count() {return count;}, get blocks() {return blocks;}, get title() {return title;}};
}
function find(node, predicate) {
  if (!node || typeof node !== 'object') return;
  if (predicate(node)) return node;
  for (const child of node.children || []) {const found = find(child, predicate); if (found) return found;}
}
for (const legacy of [false, true]) {
  const env = setup({legacy}); env.ready(); assert.equal(env.count, 1);
  env.ready(); assert.equal(env.count, 1, 'Duplicate execution must not register twice');
  const menu = find(env.render(), n => n.type === 'Menu');
  assert.equal(menu.children[0], 'Paste Markdown'); menu.props.onClick();
  let app = env.render(); assert.ok(find(app, n => n.type === 'Modal'));
  assert.ok(find(app, n => n.type === 'Button' && n.children[0] === 'Convert to Gutenberg').props.disabled);
  find(app, n => n.type === 'TextareaControl').props.onChange(fixture);
  app = env.render(); find(app, n => n.type === 'Button' && n.children[0] === 'Convert to Gutenberg').props.onClick();
  assert.equal(env.title, 'Markdown Formatting Sample');
  assert.ok(env.blocks.length > 0);
  const headings = env.blocks.filter(b => b.name === 'core/heading');
  const expected = fixture.split('\n').filter(l => /^#{2,6} /.test(l));
  assert.equal(headings.length, expected.length);
  expected.forEach((line, i) => assert.equal(headings[i].attributes.level, line.match(/^#+/)[0].length));
  assert.ok(env.blocks.some(b => b.name === 'core/list' && b.attributes.ordered));
  assert.ok(env.blocks.some(b => b.name === 'core/list' && !b.attributes.ordered));
  assert.ok(env.blocks.some(b => b.name === 'core/paragraph' && b.attributes.content.includes('<strong>')));
  assert.equal(env.states[0], false, 'Modal closes after conversion');
  console.log(`PASS ${legacy ? 'legacy fallback' : 'modern wp.editor without wp.editPost'}: menu, dialog, fixture import (${env.blocks.length} blocks, ${headings.length} headings), title and options retained`);
}
const noPanel = setup({panel: false}); noPanel.ready(); assert.ok(find(noPanel.render(), n => n.type === 'Menu'));
const missing = setup({missing: true}); missing.ready(); assert.equal(missing.count, 0); assert.equal(missing.errors.length, 1);
console.log('PASS missing optional panel, missing API diagnostics, domReady timing and duplicate protection');
