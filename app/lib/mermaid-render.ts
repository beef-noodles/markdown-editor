import mermaid from "mermaid";

mermaid.initialize({
  startOnLoad: false,
  theme: "default",
  securityLevel: 'loose',
  maxTextSize: 50000
});

const FAILED_TO_RENDER = `<pre style='color:red'>Failed to render Mermaid\n</pre>`;

const errorLog = (e: Error) => { console.error('Mermaid render error:', e); }

export async function renderMermaid(element: HTMLElement) {
  const preBlocks = Array.from(element.querySelectorAll('pre > code.language-mermaid'));
  for (const [i, codeBlock] of preBlocks.entries()) {
    const pre = codeBlock.parentElement as HTMLElement;
    if (!pre) continue;
    if (pre.nextElementSibling && pre.nextElementSibling.classList.contains('mermaid')) continue;
    const code = codeBlock.textContent || '';
    const container = document.createElement('div');
    container.className = 'mermaid';
    container.id = `mermaid-svg-${i}-${Date.now()}`;
    try {
      const { svg } = await mermaid.render(container.id, code);
      container.innerHTML = svg;
      pre.parentElement?.replaceChild(container, pre);
    } catch (e) {
      container.innerHTML = FAILED_TO_RENDER;
      pre.parentElement?.replaceChild(container, pre);
      errorLog(e as Error);
    }
  }

  const otherBlocks = Array.from(element.querySelectorAll('code.language-mermaid, pre.language-mermaid, .language-mermaid'));
  for (const [i, block] of otherBlocks.entries()) {
    if (block.tagName === 'CODE' && block.parentElement?.tagName === 'PRE') continue;
    if (block.parentElement?.querySelector('.mermaid')) continue;
    const code = block.textContent || '';
    const container = document.createElement('div');
    container.className = 'mermaid';
    container.id = `mermaid-svg-other-${i}-${Date.now()}`;
    block.parentElement?.replaceWith(container);
    try {
      const { svg } = await mermaid.render(container.id, code);
      container.innerHTML = svg;
    } catch (e) {
      container.innerHTML = FAILED_TO_RENDER;
      errorLog(e as Error);
    }
  }
}
