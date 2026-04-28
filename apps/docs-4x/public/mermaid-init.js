// Mermaid diagram renderer for XOOPS Docs
// Loaded as a static asset — no build step, no npm dependency.
// Starlight uses expressive-code, which renders mermaid blocks as:
//   <div class="expressive-code">
//     <figure><pre data-language="mermaid"><code>...</code></pre></figure>
//   </div>
// We target that structure, extract the raw source via textContent,
// replace the whole expressive-code container with the rendered SVG,
// and re-render when the user toggles dark/light mode.

import mermaid from 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs';

function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'light'
    ? 'default'
    : 'dark';
}

async function renderMermaid() {
  const codeBlocks = document.querySelectorAll('pre[data-language="mermaid"] code');
  if (!codeBlocks.length) return;

  mermaid.initialize({ startOnLoad: false, theme: currentTheme() });

  for (const code of codeBlocks) {
    const src = code.textContent.trim();
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
    } catch {
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
