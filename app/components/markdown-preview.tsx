
import { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { copyPreviewToClipboard, exportPreviewToPng } from '../lib/preview-utils';
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
    if (!ref.current) return;
    await copyPreviewToClipboard(ref.current, twTheme);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const handleExport = async () => {
    if (!ref.current) return;
    try {
      setExporting(true);
      await exportPreviewToPng(ref.current);
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
