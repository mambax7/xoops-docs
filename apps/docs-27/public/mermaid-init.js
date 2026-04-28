// Mermaid diagram renderer for XOOPS Docs
// Loaded as a static asset — no build step, no npm dependency.
// Finds every <pre><code class="language-mermaid"> block that Starlight emits
// and replaces it with a rendered SVG.  Re-renders when the user switches
// between dark and light mode.

import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? 'default'
    : 'dark';
}

async function renderMermaid() {
  const codeBlocks = document.querySelectorAll('pre code.language-mermaid');
  if (!codeBlocks.length) return;

  mermaid.initialize({ startOnLoad: false, theme: currentTheme() });

  for (const code of codeBlocks) {
    const pre = code.closest('pre');
    const src = code.textContent;
    const wrapper = document.createElement('div');
    wrapper.dataset.mermaidSrc = src;
    wrapper.className = 'mermaid-diagram not-content';
    wrapper.style.cssText = 'overflow-x:auto;margin:1.5rem 0;';
    try {
      const id = 'mmd-' + Math.random().toString(36).slice(2, 9);
      const { svg } = await mermaid.render(id, src);
      wrapper.innerHTML = svg;
    } catch {
      wrapper.textContent = src;
    }
    pre.replaceWith(wrapper);
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
