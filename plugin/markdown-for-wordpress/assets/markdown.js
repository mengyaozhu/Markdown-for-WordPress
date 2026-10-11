(function () {
  'use strict';
  function inline(md) {
    let s = md.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
    s = s.replace(/`([^`]+)`/g, '<code>$1</code>');
    s = s.replace(/!\[([^\]]*)\]\(([^ )]+)(?:\s+["']([^"']*)["'])?\)/g, (_, alt, url) => '<img src="'+escape(safeUrl(url))+'" alt="'+escape(alt)+'">');
    s = s.replace(/\[([^\]]+)\]\(([^ )]+)(?:\s+["']([^"']*)["'])?\)/g, (_, label, url) => '<a href="'+escape(safeUrl(url))+'">'+label+'</a>');
    s = s.replace(/\*\*\*([^*]+)\*\*\*/g, '<strong><em>$1</em></strong>');
    s = s.replace(/___([^_]+)___/g, '<strong><em>$1</em></strong>');
    s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    s = s.replace(/__([^_]+)__/g, '<strong>$1</strong>');
    s = s.replace(/~~([^~]+)~~/g, '<s>$1</s>');
    s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
    s = s.replace(/(^|[^_])_([^_\n]+)_/g, '$1<em>$2</em>');
    return s;
  }

  function isSep(line) { return /^\s*(?:---+|___+|\*\*\*+)\s*$/.test(line); }
  function isBlockStart(line) {
    return /^\s{0,3}(#{1,6})\s+/.test(line) || /^\s*```/.test(line) || /^\s*>/.test(line) || /^\s*[-+*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line) || isSep(line) || /^\s*\|.*\|\s*$/.test(line);
  }
  function tableDivider(line) { return /^\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line); }
  function cells(line) { return line.trim().replace(/^\||\|$/g,'').split('|').map(x=>x.trim()); }

  function parseMarkdown(md, opts, createBlock) {
    createBlock = createBlock || ((name, attributes = {}, innerBlocks = []) => ({name, attributes, innerBlocks}));
    const lines = md.replace(/\r\n?/g,'\n').split('\n');
    const blocks = []; let i=0; let title='';
    // Fixture-friendly metadata convention: if first H1 is followed by HR before another H1, treat pre-HR as metadata.
    if (opts.stripPreamble && /^#\s+/.test(lines[0]||'')) {
      let sep = lines.findIndex((l,idx)=>idx>0 && isSep(l));
      let nextH1 = sep >= 0 ? lines.findIndex((l,idx)=>idx>sep && /^#\s+/.test(l)) : -1;
      if (sep >= 0 && nextH1 > sep) i = nextH1;
    }
    while (i < lines.length) {
      let line=lines[i]; if (!line.trim()) { i++; continue; }
      let m=line.match(/^\s{0,3}(#{1,6})\s+(.+?)\s*#*\s*$/);
      if (m) {
        const level=m[1].length, text=m[2];
        if (level===1 && opts.useH1Title && !title) { title=text; i++; continue; }
        blocks.push(createBlock('core/heading',{level:level,content:inline(text)})); i++; continue;
      }
      if (/^\s*```/.test(line)) {
        const lang=line.trim().slice(3).trim(); const code=[]; i++;
        while(i<lines.length && !/^\s*```/.test(lines[i])) code.push(lines[i++]);
        if(i<lines.length) i++;
        blocks.push(createBlock('core/code',{content:code.join('\n'), ...(lang?{metadata:{name:'',bindings:{}}, className:'language-'+lang}: {})})); continue;
      }
      if (isSep(line)) { blocks.push(createBlock('core/separator')); i++; continue; }
      if (/^\s*>/.test(line)) {
        const q=[]; while(i<lines.length && (/^\s*>/.test(lines[i]) || !lines[i].trim())) { q.push(lines[i].replace(/^\s*>\s?/,'')); i++; }
        blocks.push(createBlock('core/quote',{},[createBlock('core/paragraph',{content:inline(q.join('\n').trim()).replace(/\n/g,'<br>')})])); continue;
      }
      if (/^\s*[-+*]\s+/.test(line) || /^\s*\d+[.)]\s+/.test(line)) {
        const ordered=/^\s*\d+[.)]\s+/.test(line); const start=ordered?parseInt(line.trim(),10):1; const items=[];
        while(i<lines.length) {
          const mm=lines[i].match(ordered?/^\s*\d+[.)]\s+(.+)/:/^\s*[-+*]\s+(.+)/);
          if(!mm) {
            // Blank lines between Markdown list items still belong to one list.
            let next=i;
            while(next<lines.length && !lines[next].trim()) next++;
            if(next>i && next<lines.length && (ordered?/^\s*\d+[.)]\s+/.test(lines[next]):/^\s*[-+*]\s+/.test(lines[next]))) {i=next;continue;}
            break;
          }
          items.push(createBlock('core/list-item',{content:inline(mm[1])})); i++;
        }
        blocks.push(createBlock('core/list',{ordered:ordered,...(ordered && start!==1?{start:start}:{})},items)); continue;
      }
      if (/^\s*\|.*\|\s*$/.test(line) && i+1<lines.length && tableDivider(lines[i+1])) {
        const head=cells(line); i+=2; const body=[];
        while(i<lines.length && /^\s*\|.*\|\s*$/.test(lines[i])) body.push(cells(lines[i++]));
        const mkRow=(r,tag)=>({cells:r.map(c=>({content:inline(c),tag:tag}))});
        blocks.push(createBlock('core/table',{hasFixedLayout:false,head:[mkRow(head,'th')],body:body.map(r=>mkRow(r,'td')),foot:[]})); continue;
      }
      const img=line.match(/^\s*!\[([^\]]*)\]\(([^ )]+)(?:\s+["']([^"']*)["'])?\)\s*$/);
      if(img){ blocks.push(createBlock('core/image',{url:safeUrl(img[2]),alt:img[1],caption:img[3]||''})); i++; continue; }
      const p=[line]; i++;
      while(i<lines.length && lines[i].trim() && !isBlockStart(lines[i])) p.push(lines[i++]);
      blocks.push(createBlock('core/paragraph',{content:inline(p.join(' '))}));
    }
    return {blocks,title};
  }


  function escape(s) { return String(s || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }
  function render(block) {
    const a = block.attributes || {}, children = (block.innerBlocks || []).map(render).join('\n');
    switch (block.name) {
      case 'core/heading': return '<h'+a.level+'>'+a.content+'</h'+a.level+'>';
      case 'core/paragraph': return '<p>'+a.content+'</p>';
      case 'core/list': {const tag=a.ordered?'ol':'ul'; return '<'+tag+(a.ordered && a.start?' start="'+a.start+'"':'')+'>'+children+'</'+tag+'>';}
      case 'core/list-item': return '<li>'+a.content+children+'</li>';
      case 'core/quote': return '<blockquote>'+children+'</blockquote>';
      case 'core/code': return '<pre><code'+(a.className?' class="'+escape(a.className)+'"':'')+'>'+escape(a.content)+'</code></pre>';
      case 'core/separator': return '<hr>';
      case 'core/image': return '<figure><img src="'+escape(safeUrl(a.url))+'" alt="'+escape(a.alt)+'">'+(a.caption?'<figcaption>'+escape(a.caption)+'</figcaption>':'')+'</figure>';
      case 'core/table': {
        const rows = (data, tag) => (data || []).map(row => '<tr>'+row.cells.map(cell => '<'+tag+'>'+cell.content+'</'+tag+'>').join('')+'</tr>').join('');
        return '<table><thead>'+rows(a.head,'th')+'</thead><tbody>'+rows(a.body,'td')+'</tbody></table>';
      }
      default: throw new Error('Unsupported Markdown block: '+block.name);
    }
  }
  function looksLikeMarkdown(md) {
    return /(^|\n)\s{0,3}(?:#{1,6}\s+|```|>\s+|[-+*]\s+|\d+[.)]\s+|\|.+\|)|\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)/.test(md);
  }
  function safeUrl(url) {
    // HTML entities and control characters must not conceal an unsafe scheme.
    const decoded = String(url).replace(/&amp;/gi,'&').replace(/&#(x[0-9a-f]+|\d+);?/gi, (_, n) => String.fromCharCode(n[0].toLowerCase()==='x'?parseInt(n.slice(1),16):parseInt(n,10))).replace(/&colon;/gi,':');
    const normalized = decoded.replace(/[\u0000-\u0020\u007f]/g,'');
    return /^(?:javascript|vbscript|data):/i.test(normalized) || (/^[a-z][a-z\d+.-]*:/i.test(normalized) && !/^(?:https?|mailto|tel):/i.test(normalized)) ? '' : decoded;
  }
  window.MFWMarkdown = {
    parse:parseMarkdown, looksLikeMarkdown,
    toHTML(md, options) {const out=parseMarkdown(md, options || {useH1Title:false,stripPreamble:true});return {html:out.blocks.map(render).join('\n\n'),title:out.title,blocks:out.blocks};}
  };
})();
