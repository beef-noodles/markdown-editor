
import { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { renderMermaid } from '../lib/mermaid-render';
import { renderLatexInElement } from '../lib/latex-render';
import { appendReferencesSection } from '../lib/references';
import inlineTheme from '../lib/inline-theme';
import { highlightCode } from '../lib/highlight';
import twTheme from './theme/tw.css?raw';
interface Props {
  innerHTML: string
}

export const MarkdownPreview = ({ innerHTML }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);


  useEffect(() => {
    if (ref.current) {
      const articleHTML = `<article>${innerHTML}</article>`;
      const highlightedContent = highlightCode(articleHTML);
      const withReferences = appendReferencesSection(highlightedContent) as string;
      const styledContent = inlineTheme(withReferences, twTheme);
      ref.current.innerHTML = styledContent;
      renderLatexInElement(ref.current);
      renderMermaid(ref.current);
    }
  }, [innerHTML]);

  const handleCopy = async () => {
    if (ref.current) {
      renderLatexInElement(ref.current);
      await renderMermaid(ref.current);

      const articleHTML = ref.current.innerHTML;
      const withReferences = appendReferencesSection(articleHTML) as string;
      const styledContent = inlineTheme(withReferences, twTheme);

      await navigator.clipboard.write([
        new window.ClipboardItem({
          'text/html': new Blob([styledContent], { type: 'text/html' }),
          'text/plain': new Blob([ref.current.textContent || ''], { type: 'text/plain' })
        })
      ]);

      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      <div className="relative w-1/2 h-full max-w-none overflow-y-auto markdown-body" ref={ref}>
      </div>
      <Button
        onClick={handleCopy}
        className="fixed right-8 bottom-8 z-10 px-4 py-2 rounded bg-primary text-primary-foreground shadow-lg hover:bg-primary/80 transition-all"
        style={{ pointerEvents: 'auto' }}
      >
        {copied ? 'Copied' : 'Copy'}
      </Button>
    </>

  );
}
