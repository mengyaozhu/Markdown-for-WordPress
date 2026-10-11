(function () {
  'use strict';
  const wp = window.wp;
  if (!wp || typeof wp.domReady !== 'function') {
    console.error('Markdown for WordPress: wp-dom-ready did not load.');
    return;
  }
  wp.domReady(function () {
  // Resolve globals only after WordPress has loaded the declared dependencies.
  const editor = wp.editor || {};
  const legacy = wp.editPost || {};
  const PluginMoreMenuItem = editor.PluginMoreMenuItem || legacy.PluginMoreMenuItem;
  const PluginDocumentSettingPanel = editor.PluginDocumentSettingPanel || legacy.PluginDocumentSettingPanel;
  if (!wp.element || !wp.components || !wp.plugins || !wp.blocks || !wp.data ||
      typeof wp.plugins.registerPlugin !== 'function' ||
      typeof wp.blocks.createBlock !== 'function') {
    console.error('Markdown for WordPress: required WordPress editor APIs are unavailable.');
    return;
  }
  if (wp.plugins.getPlugin && wp.plugins.getPlugin('markdown-for-wordpress')) return;
  const el = wp.element.createElement;
  const { useState } = wp.element;
  const { Button, Modal, TextareaControl, CheckboxControl, Notice } = wp.components;
  const { registerPlugin } = wp.plugins;
  const { createBlock } = wp.blocks;
  const { dispatch } = wp.data;

  const parseMarkdown = (md, opts) => window.MFWMarkdown.parse(md, opts, createBlock);

  function installDirectPaste() {
    if (typeof document === 'undefined' || typeof wp.data.select !== 'function') return;
    const boundDocuments = new WeakSet(), boundFrames = new WeakSet();
    function paste(event) {
      const target = event.target;
      if (event.defaultPrevented || !target || !target.closest || !event.clipboardData ||
          event.clipboardData.files.length || !target.closest('[contenteditable="true"]')) return;
      // Never take over title fields, plugin textareas, code blocks or arbitrary controls.
      const blockElement = target.closest('[data-block]');
      if (!blockElement || !target.closest('.block-editor-block-list__layout')) return;
      const md = event.clipboardData.getData('text/plain');
      if (!/(^|\n)\s{0,3}(?:#{1,6}\s+|```|>\s+|[-+*]\s+|\d+[.)]\s+|\|.+\|)|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)/.test(md)) return;
      try {
        const store = wp.data.select('core/block-editor');
        const actions = dispatch('core/block-editor');
        const selected = store.getSelectedBlock();
        if (!selected || selected.clientId !== blockElement.getAttribute('data-block') ||
            selected.name !== 'core/paragraph' || String(selected.attributes.content || '').trim() ||
            (store.getSelectedBlockClientIds && store.getSelectedBlockClientIds().length !== 1)) return;
        // Keep H1 in the body on direct paste; the dialog still offers post-title extraction.
        const out = parseMarkdown(md, {useH1Title:false, stripPreamble:true});
        const root = store.getBlockRootClientId(selected.clientId);
        if (!out.blocks.length || typeof actions.replaceBlocks !== 'function' ||
            typeof store.canInsertBlocks !== 'function' || !store.canInsertBlocks(out.blocks, root) ||
            typeof store.canRemoveBlock !== 'function' || !store.canRemoveBlock(selected.clientId)) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        actions.replaceBlocks([selected.clientId], out.blocks);
      } catch (error) {
        console.error('Markdown for WordPress: direct paste could not complete.', error);
      }
    }
    function bind(doc) {
      if (!doc || boundDocuments.has(doc)) return;
      boundDocuments.add(doc);
      doc.addEventListener('paste', paste, true);
      function frames() {
        doc.querySelectorAll('iframe').forEach(frame => {
          function bindFrame() {
            try { bind(frame.contentDocument); } catch (_) { /* Cross-origin frames are unrelated. */ }
          }
          if (!boundFrames.has(frame)) {
            boundFrames.add(frame);
            frame.addEventListener('load', bindFrame);
          }
          bindFrame();
        });
      }
      frames();
      if (typeof MutationObserver !== 'undefined') {
        const observer = new MutationObserver(frames);
        observer.observe(doc.documentElement, {childList:true, subtree:true});
      }
    }
    bind(document);
  }
  installDirectPaste();
  // Clipboard conversion is independent of sidebar/menu SlotFill availability.
  if (!PluginMoreMenuItem) {
    console.error('Markdown for WordPress: menu API unavailable; direct paste is still enabled.');
    return;
  }

  function App(){
    const [open,setOpen]=useState(false), [md,setMd]=useState(''), [useTitle,setUseTitle]=useState(true), [strip,setStrip]=useState(true), [error,setError]=useState('');
    function convert(){
      try {
        const out=parseMarkdown(md,{useH1Title:useTitle,stripPreamble:strip});
        if(!out.blocks.length) throw new Error('No Markdown content was detected.');
        const blockEditor = dispatch('core/block-editor');
        const postEditor = dispatch('core/editor');
        if (!blockEditor || typeof blockEditor.resetBlocks !== 'function' ||
            !postEditor || typeof postEditor.editPost !== 'function') {
          throw new Error('Open a post or page in the WordPress block editor to import Markdown.');
        }
        blockEditor.resetBlocks(out.blocks);
        if(out.title) postEditor.editPost({title:out.title});
        setOpen(false); setError('');
      } catch(e){ setError(e.message||String(e)); }
    }
    return el(wp.element.Fragment,null,
      el(PluginMoreMenuItem,{icon:'media-text',onClick:()=>setOpen(true)},'Paste Markdown'),
      PluginDocumentSettingPanel && el(PluginDocumentSettingPanel,{name:'markdown-for-wordpress',title:'Markdown Import',className:'mfw-panel'},
        el('p',null,'Paste Markdown and convert it to native editable Gutenberg blocks.'),
        el(Button,{variant:'primary',onClick:()=>setOpen(true)},'Paste Markdown')
      ),
      open && el(Modal,{title:'Paste Markdown',onRequestClose:()=>setOpen(false),shouldCloseOnClickOutside:false},
        error && el(Notice,{status:'error',isDismissible:true,onRemove:()=>setError('')},error),
        el('p',null,'Conversion replaces all current post blocks. Save a draft or copy your content first.'),
        el(TextareaControl,{label:'Markdown',help:'Paste the complete contents of your .md file.',value:md,onChange:setMd,rows:18}),
        el(CheckboxControl,{label:'Use first article H1 as the WordPress post title',checked:useTitle,onChange:setUseTitle}),
        el(CheckboxControl,{label:'Ignore metadata-style H1 before an initial --- separator',checked:strip,onChange:setStrip}),
        el('div',{style:{display:'flex',gap:'8px',justifyContent:'flex-end'}},
          el(Button,{variant:'tertiary',onClick:()=>setOpen(false)},'Cancel'),
          el(Button,{variant:'primary',disabled:!md.trim(),onClick:convert},'Convert to Gutenberg')
        )
      )
    );
  }
  registerPlugin('markdown-for-wordpress',{render:App});
  });
})();
