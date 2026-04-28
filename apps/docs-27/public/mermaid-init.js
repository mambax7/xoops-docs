// Mermaid diagram renderer for XOOPS Docs
// Loaded as a static asset — no build step, no npm dependency.
//
// Starlight uses expressive-code, which renders mermaid blocks as:
//   <div class="expressive-code">
//     <figure><pre data-language="mermaid"><code>
//       <div class="ec-line"><div class="code">...</div></div>
//       ...
//     </code></pre></figure>
//   </div>
//
// IMPORTANT: textContent on the <code> element concatenates ec-line divs
// without newlines, producing invalid Mermaid source.  We must join each
// .ec-line's textContent with '\n' to reconstruct the original diagram.

import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? 'default'
    : 'dark';
}

function extractSource(code) {
  // expressive-code wraps each line in .ec-line; join them to restore newlines
  const lines = code.querySelectorAll('.ec-line');
  if (lines.length) {
    return Array.from(lines).map(l => l.textContent).join('\n').trim();
  }
  // Fallback for plain <code> blocks (no expressive-code)
  return code.textContent.trim();
}

async function renderMermaid() {
  const codeBlocks = document.querySelectorAll('pre[data-language="mermaid"] code');
  if (!codeBlocks.length) return;

  mermaid.initialize({ startOnLoad: false, theme: currentTheme() });

  for (const code of codeBlocks) {
    const src = extractSource(code);
    // Replace the whole expressive-code wrapper, falling back to the <pre>
    const container = code.closest('.expressive-code') || code.closest('pre');
    const wrapper = document.createElement('div');
    wrapper.dataset.mermaidSrc = src;
    wrapper.className = 'mermaid-diagram not-content';
    wrapper.style.cssText = 'overflow-x:auto;margin:1.5rem 0;';
    try {
      const id = 'mmd-' + Math.random().toString(36).slice(2, 9);
      const { svg } = await mermaid.render(id, src);
      wrapper.innerHTML = svg;
    } catch (e) {
      console.error('Mermaid render error:', e, '\nSource:\n', src);
      wrapper.textContent = src;
    }
    container.replaceWith(wrapper);
  }
}

async function rerenderMermaid() {
  const diagrams = document.querySelectorAll('[data-mermaid-src]');
  if (!diagrams.length) return;

  mermaid.initialize({ startOnLoad: false, theme: currentTheme() });

  for (const wrapper of diagrams) {
    try {
      const id = 'mmd-' + Math.random().toString(36).slice(2, 9);
      const { svg } = await mermaid.render(id, wrapper.dataset.mermaidSrc);
      wrapper.innerHTML = svg;
    } catch { /* leave previous render in place */ }
  }
}

// astro:page-load fires on every navigation AND on the initial page load
document.addEventListener('astro:page-load', renderMermaid);

// Re-render with correct palette when the user toggles dark/light
new MutationObserver(rerenderMermaid)
  .observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
