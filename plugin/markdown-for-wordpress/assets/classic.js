(function () {
  'use strict';
  wp.domReady(function () {
    const converter = window.MFWMarkdown;
    const textarea = document.getElementById('content');
    if (!converter || !textarea) return;
    function convert(md) {
      const out = converter.toHTML(md, {useH1Title:false,stripPreamble:true});
      if (!out.blocks.length) throw new Error('No Markdown content was found.');
      return out.html;
    }
    textarea.addEventListener('paste', function (event) {
      if (event.defaultPrevented || !event.clipboardData || event.clipboardData.files.length) return;
      const md = event.clipboardData.getData('text/plain');
      if (!converter.looksLikeMarkdown(md)) return;
      try {
        const html = convert(md);
        event.preventDefault();
        event.stopImmediatePropagation();
        textarea.setRangeText(html, textarea.selectionStart, textarea.selectionEnd, 'end');
        textarea.dispatchEvent(new Event('input', {bubbles:true}));
        textarea.dispatchEvent(new Event('change', {bubbles:true}));
      } catch (error) { console.error('Markdown for WordPress: conversion failed.', error); }
    }, true);
    const bound = new WeakSet();
    function bindVisual(editor) {
      if (editor.id !== 'content' || bound.has(editor)) return;
      const doc = editor.getDoc();
      if (!doc) return;
      bound.add(editor);
      doc.addEventListener('paste', function (event) {
        if (event.defaultPrevented || !event.clipboardData || event.clipboardData.files.length) return;
        const md = event.clipboardData.getData('text/plain');
        if (!converter.looksLikeMarkdown(md)) return;
        try {
          const html = convert(md);
          event.preventDefault();
          event.stopImmediatePropagation();
          editor.undoManager.transact(function () {editor.insertContent(html);});
          editor.save(); editor.nodeChanged();
        } catch (error) { console.error('Markdown for WordPress: conversion failed.', error); }
      }, true);
    }
    if (window.tinymce) {
      const existing = window.tinymce.get('content');
      if (existing) {bindVisual(existing); existing.on('init', () => bindVisual(existing));}
      window.tinymce.on('AddEditor', event => {
        const editor = event.editor;
        if (editor.id === 'content') editor.on('init', () => bindVisual(editor));
      });
    }
  });
})();
