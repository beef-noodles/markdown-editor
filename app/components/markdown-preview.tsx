
import { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { toPng } from 'html-to-image';
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
  const [exporting, setExporting] = useState(false);


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

  const handleExport = async () => {
    if (!ref.current) return;
    try {
      setExporting(true);
      renderLatexInElement(ref.current);
      await renderMermaid(ref.current);

      const node = ref.current;
      const article = node.querySelector('article') as HTMLElement | null;
      const target = article ?? node;

      const desiredWidth = 960;

      const dataUrl = await toPng(target, {
        width: desiredWidth,
        style: {
          width: `${desiredWidth}px`,
          background: '#ffffff',
          boxSizing: 'border-box',
          display: 'block',
          position: 'static',
        },
        backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--background') || '#ffffff',
      });

      const link = document.createElement('a');
      link.download = `markdown-preview-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-')}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error('Failed to export image', e);
    } finally {
      setExporting(false);
    }
  }

  return (
    <>
      <div className="relative w-1/2 h-full max-w-none overflow-y-auto markdown-body" ref={ref}>
      </div>
      <div className="fixed right-8 bottom-8 z-10 flex flex-col gap-2">
        <Button
          onClick={handleCopy}
          className="px-4 py-2 rounded bg-primary text-primary-foreground shadow-lg hover:bg-primary/80 transition-all"
          style={{ pointerEvents: 'auto' }}
        >
          {copied ? 'Copied' : 'Copy to email'}
        </Button>
        <Button
          onClick={handleExport}
          disabled={exporting}
          className="px-4 py-2 rounded bg-primary text-primary-foreground shadow-lg hover:bg-primary/80 transition-all disabled:opacity-60"
          style={{ pointerEvents: 'auto' }}
        >
          {exporting ? 'Exporting…' : 'Export PNG'}
        </Button>
      </div>
    </>

  );
}
