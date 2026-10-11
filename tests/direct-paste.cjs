const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const common = fs.readFileSync(path.join(__dirname, '../plugin/markdown-for-wordpress/assets/markdown.js'), 'utf8');
const source = fs.readFileSync(path.join(__dirname, '../plugin/markdown-for-wordpress/assets/editor.js'), 'utf8');
const fixture = fs.readFileSync(path.join(__dirname, 'fixtures/sample.md'), 'utf8');
function doc() {return {handlers: {}, frames: [], documentElement: {}, addEventListener(name, cb, capture) {
  assert.equal(capture, true); assert.equal(name, 'paste'); assert.ok(!this.handlers[name]); this.handlers[name] = cb;
}, querySelectorAll() {return this.frames;}};}
const main = doc(), canvas = doc();
const frame = {contentDocument: canvas, addEventListener(name, callback) {assert.equal(name, 'load'); this.load = callback;}};
main.frames.push(frame);
let ready, selected = {clientId: 'empty', name: 'core/paragraph', attributes: {content: ''}}, locked = false, count = 0, imported, ids;
const observers = [];
const store = {getSelectedBlock: () => selected, getSelectedBlockClientIds: () => ['empty'], getBlockRootClientId: () => '', canInsertBlocks: () => !locked, canRemoveBlock: () => !locked};
const wp = {domReady: cb => {ready = cb;}, element: {}, components: {}, editor: {}, plugins: {registerPlugin: () => {throw new Error('Menu deliberately unavailable');}},
  blocks: {createBlock: (name, attributes = {}, innerBlocks = []) => ({name, attributes, innerBlocks})},
  data: {select: () => store, dispatch: () => ({replaceBlocks: (clientIds, blocks) => {count++; ids = clientIds; imported = blocks;}})}};
vm.runInNewContext(common + '\n' + source, {window: {wp}, document: main, console: {error: () => {}}, MutationObserver: class {constructor(cb) {observers.push(cb);} observe() {}}});
assert.equal(main.handlers.paste, undefined); ready(); assert.ok(main.handlers.paste); assert.ok(canvas.handlers.paste);
function paste(text, overrides = {}, document = main) {
  let prevented = false, stopped = false;
  const event = {defaultPrevented: false, target: {closest: selector => selector === '[data-block]' ? {getAttribute: () => 'empty'} : {}},
    clipboardData: {files: [], getData: type => {assert.equal(type, 'text/plain'); return text;}},
    preventDefault: () => {prevented = true;}, stopImmediatePropagation: () => {stopped = true;}, ...overrides};
  document.handlers.paste(event); return {prevented, stopped};
}
assert.deepEqual(paste(fixture), {prevented: true, stopped: true}); assert.equal(count, 1);
assert.equal(ids[0], 'empty'); assert.ok(imported.length > 0); assert.equal(imported[0].name, 'core/heading');
assert.equal(imported[0].attributes.content, 'Markdown Formatting Sample');
assert.ok(!imported.some(b => b.attributes.content && b.attributes.content.startsWith('Content - Sample')));
assert.deepEqual(paste('## Iframe heading\n\nText', {}, canvas), {prevented: true, stopped: true}); assert.equal(count, 2);
assert.equal(paste('ordinary text').prevented, false);
selected.attributes.content = 'Existing content'; assert.equal(paste('## Heading').prevented, false); selected.attributes.content = '';
selected.name = 'core/code'; assert.equal(paste('## Heading').prevented, false); selected.name = 'core/paragraph';
locked = true; assert.equal(paste('## Heading').prevented, false); locked = false;
assert.equal(paste('## Heading', {target: {closest: () => null}}).prevented, false);
assert.equal(paste('## Heading', {defaultPrevented: true}).prevented, false);
assert.equal(paste('## Heading', {clipboardData: {files: [{}]}}).prevented, false);
store.getSelectedBlockClientIds = () => ['empty', 'other']; assert.equal(paste('## Heading').prevented, false); store.getSelectedBlockClientIds = () => ['empty'];
assert.equal(count, 2, 'No changes for excluded paste contexts');
observers.forEach(cb => cb()); frame.load();
const replacementCanvas = doc(); frame.contentDocument = replacementCanvas; frame.load();
assert.ok(replacementCanvas.handlers.paste);
assert.equal(paste('**Bold**', {}, replacementCanvas).prevented, true); assert.equal(count, 3);
console.log('PASS direct paste: main document, iframe and iframe reload; independent of menu API; fixture (native blocks, H1 preserved, metadata removed); plain text, populated/code blocks, locked blocks, controls, file paste, handled events and multi-selection preserved');
