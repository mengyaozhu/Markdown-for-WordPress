const {JSDOM} = require('jsdom');
const fs = require('node:fs');
const assert = require('node:assert/strict');
const base = '../plugin/markdown-for-wordpress/';
const fixture = fs.readFileSync(__dirname+'/fixtures/sample.md', 'utf8');
const common = fs.readFileSync(__dirname+'/'+base+'assets/markdown.js', 'utf8');
const classic = fs.readFileSync(__dirname+'/'+base+'assets/classic.js', 'utf8');
function setup({visual = false, delayed = false} = {}) {
  const dom = new JSDOM('<textarea id="content"></textarea><iframe id="content_ifr"></iframe>', {runScripts:'outside-only',url:'https://example.test/wp-admin/post.php'});
  const window = dom.window;
  const textarea = window.document.getElementById('content');
  const canvas = window.document.getElementById('content_ifr').contentDocument;
  canvas.body.contentEditable = 'true';
  let saves = 0, undo = 0, ready, onAdd, init;
  const editor = {id:'content',isHidden:()=>!visual,getDoc:()=>canvas,
    getContent:()=>canvas.body.textContent,
    insertContent:html=>canvas.body.insertAdjacentHTML('beforeend',html),
    setContent:html=>{canvas.body.innerHTML=html;},
    save:()=>{saves++;textarea.value=canvas.body.innerHTML;},nodeChanged:()=>{},
    on:(event,cb)=>{if(event==='init')init=cb;},undoManager:{transact:cb=>{undo++;cb();}}};
  window.wp = {domReady: cb=>{ready=cb;}};
  window.tinymce = {get:()=>delayed?null:editor,on:(event,cb)=>{assert.equal(event,'AddEditor');onAdd=cb;}};
  window.eval(common);window.eval(classic);assert.equal(onAdd,undefined);ready();
  if(delayed) {onAdd({editor});init();}
  function paste(target,text,files=[]) {
    const event = new window.Event('paste',{bubbles:true,cancelable:true});
    Object.defineProperty(event,'clipboardData',{value:{files,getData:()=>text}});
    target.dispatchEvent(event);return event.defaultPrevented;
  }
  return {window,textarea,canvas,editor,paste,dom,get saves(){return saves;},get undo(){return undo;}};
}
const code = setup();
code.textarea.value='Before\n\nAfter';code.textarea.setSelectionRange(8,8);
let inputs=0;code.textarea.addEventListener('input',()=>inputs++);
assert.equal(code.paste(code.textarea,'## Heading\n\n**Bold**'),true);
assert.ok(code.textarea.value.startsWith('Before\n\n<h2>Heading</h2>'));
assert.ok(code.textarea.value.endsWith('After'));assert.ok(code.textarea.value.includes('<strong>Bold</strong>'));assert.equal(inputs,1);
assert.equal(code.paste(code.textarea,'Ordinary prose'),false);
assert.equal(code.paste(code.textarea,'## Heading',[{}]),false);
code.textarea.value='';code.textarea.setSelectionRange(0,0);assert.equal(code.paste(code.textarea,fixture),true);
const parsed = new JSDOM(code.textarea.value).window.document;
assert.equal(parsed.querySelectorAll('h2,h3,h4,h5,h6').length, fixture.split('\n').filter(line => /^#{2,6} /.test(line)).length);
assert.ok(parsed.querySelector('strong'));assert.ok(parsed.querySelector('ol li'));assert.ok(parsed.querySelector('ul li'));
assert.ok(!parsed.body.textContent.includes('**Duty-based statement:**'));
const visual = setup({visual:true});
visual.canvas.body.innerHTML='<p>Existing content</p>';
assert.equal(visual.paste(visual.canvas.body,'## New heading\n\n- One\n- Two'),true);
assert.equal(visual.canvas.querySelector('h2').textContent,'New heading');assert.equal(visual.canvas.querySelectorAll('ul li').length,2);
assert.ok(visual.canvas.body.textContent.startsWith('Existing content'));assert.equal(visual.saves,1);assert.equal(visual.undo,1);
visual.canvas.body.innerHTML='';assert.equal(visual.paste(visual.canvas.body,'# Title\n\n**Bold**'),true);assert.equal(visual.canvas.querySelector('h1').textContent,'Title');assert.ok(visual.canvas.querySelector('strong'));
const late=setup({visual:true,delayed:true});assert.equal(late.paste(late.canvas.body,'## Late init'),true);assert.ok(late.canvas.querySelector('h2'));
console.log('PASS real DOM Classic Code paste, selection-preserving insertion, input events, full-fixture automatic paste (section headings, bold, ordered/unordered lists), Visual iframe paste, undo/save API calls, Visual formatting and delayed TinyMCE init. TinyMCE API is stubbed; no live site mutation.');
