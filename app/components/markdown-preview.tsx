
import { useRef, useEffect, useState } from "react";
import { Button } from "./ui/button";
interface Props {
  innerHTML: string
}

export const MarkdownPreview = ({ innerHTML }: Props) => {
  const ref = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = innerHTML;
    }
  }, [innerHTML]);

  const handleCopy = async () => {
    if (ref.current) {
      await navigator.clipboard.write([
        new window.ClipboardItem({
          'text/html': new Blob([ref.current.innerHTML], { type: 'text/html' }),
          'text/plain': new Blob([ref.current.innerText], { type: 'text/plain' })
        })
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  return (
    <>
      <div className="relative w-1/2 h-full max-w-none overflow-y-auto markdown-body" ref={ref} />
      <Button
        onClick={handleCopy}
        className="fixed right-8 bottom-8 z-10 px-4 py-2 rounded bg-primary text-primary-foreground shadow-lg hover:bg-primary/80 transition-all"
        style={{ pointerEvents: 'auto' }}
      >
        {copied ? '已复制' : '复制到邮件'}
      </Button>
    </>

  );
}
