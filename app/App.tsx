
import { useState, useEffect } from 'react';
import init, { render_markdown } from '../pkg/markdown_editor.js';
import { MarkdownEditor } from './components/markdown-editor.js';
import { MarkdownPreview } from './components/markdown-preview.js';
import './App.css';


function App() {
  const [markdown, setMarkdown] = useState<string>("# Hello, Monaco Editor\n\nThis is a markdown editor.");
  const [innerHTML, setInnerHTML] = useState<string>('');
  const [wasmReady, setWasmReady] = useState(false);

  useEffect(() => {
    (async () => {
      await init();
      setWasmReady(true);
    })();
  }, []);

  useEffect(() => {
    if (wasmReady) {
      const html = render_markdown(markdown);
      setInnerHTML(html);
    }
  }, [markdown, wasmReady]);

  return (
    <div className="w-full h-full flex flex-row items-center justify-center">
      <MarkdownEditor value={markdown} onChange={setMarkdown} />
      <MarkdownPreview innerHTML={innerHTML} />
    </div>
  );
}

export default App
