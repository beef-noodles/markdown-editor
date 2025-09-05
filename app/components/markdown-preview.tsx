
import { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { renderMermaid } from '../lib/mermaid-render';
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
      const styledContent = inlineTheme(highlightedContent, twTheme);
      ref.current.innerHTML = styledContent;
      renderMermaid(ref.current);
    }
  }, [innerHTML]);

  const handleCopy = async () => {
    if (ref.current) {
      const articleHTML = ref.current.innerHTML;
      const styledContent = inlineTheme(articleHTML, twTheme);

      await navigator.clipboard.write([
        new window.ClipboardItem({
          'text/html': new Blob([styledContent], { type: 'text/html' }),
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
