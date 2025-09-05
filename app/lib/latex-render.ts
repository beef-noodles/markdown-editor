import katex from 'katex';
import 'katex/dist/katex.min.css';

export function renderLatex(html: string): string {
  html = html.replace(/\$([^$]+)\$/g, (match, math) => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: false,
        output: 'html'
      });
    } catch (error) {
      console.warn('KaTeX inline math error:', error);
      return match;
    }
  });

  html = html.replace(/\$\$([^$]+)\$\$/g, (match, math) => {
    try {
      return katex.renderToString(math, {
        throwOnError: false,
        displayMode: true,
        output: 'html'
      });
    } catch (error) {
      console.warn('KaTeX block math error:', error);
      return match;
    }
  });

  return html;
}

export function renderLatexInElement(element: HTMLElement): void {
  if (!element) return;

  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT
  );

  const textNodes: Text[] = [];
  let node: Node | null = walker.nextNode();

  while (node) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent) {
      const text = node.textContent;
      if (/\$[^$]+\$|\$\$[^$]+\$\$/.test(text)) {
        textNodes.push(node as Text);
      }
    }
    node = walker.nextNode();
  }

  textNodes.forEach(textNode => {
    const parent = textNode.parentElement;
    if (!parent) return;

    const text = textNode.textContent || '';
    const parts = text.split(/(\$\$[^$]+\$\$|\$[^$]+\$)/);

    if (parts.length > 1) {
      const fragment = document.createDocumentFragment();

      parts.forEach(part => {
        if (part.startsWith('$$') && part.endsWith('$$')) {
          const math = part.slice(2, -2);
          try {
            const rendered = katex.renderToString(math, {
              throwOnError: false,
              displayMode: true,
              output: 'html'
            });
            const div = document.createElement('div');
            div.innerHTML = rendered;
            div.className = 'katex-display';
            fragment.appendChild(div);
          } catch (error) {
            console.warn('KaTeX block math error:', error);
            fragment.appendChild(document.createTextNode(part));
          }
        } else if (part.startsWith('$') && part.endsWith('$')) {
          const math = part.slice(1, -1);
          try {
            const rendered = katex.renderToString(math, {
              throwOnError: false,
              displayMode: false,
              output: 'html'
            });
            const span = document.createElement('span');
            span.innerHTML = rendered;
            fragment.appendChild(span);
          } catch (error) {
            console.warn('KaTeX inline math error:', error);
            fragment.appendChild(document.createTextNode(part));
          }
        } else if (part) {
          fragment.appendChild(document.createTextNode(part));
        }
      });

      parent.replaceChild(fragment, textNode);
    }
  });
}
