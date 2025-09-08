import * as React from "react"
import * as monaco from 'monaco-editor';
// Configure Monaco web workers for Vite
// See: https://github.com/microsoft/monaco-editor#faq
// and Vite worker import docs
// Import worker entry points
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import jsonWorker from 'monaco-editor/esm/vs/language/json/json.worker?worker'
import cssWorker from 'monaco-editor/esm/vs/language/css/css.worker?worker'
import htmlWorker from 'monaco-editor/esm/vs/language/html/html.worker?worker'
import tsWorker from 'monaco-editor/esm/vs/language/typescript/ts.worker?worker'

declare const self: any

// Ensure Monaco knows how to spawn workers
self.MonacoEnvironment = {
  getWorker(_moduleId: string, label: string) {
    switch (label) {
      case 'json':
        return new jsonWorker()
      case 'css':
      case 'scss':
      case 'less':
        return new cssWorker()
      case 'html':
      case 'handlebars':
      case 'razor':
        return new htmlWorker()
      case 'typescript':
      case 'javascript':
        return new tsWorker()
      default:
        return new editorWorker()
    }
  },
}

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string) => void;
}

export function MarkdownEditor({ value = '', onChange }: MarkdownEditorProps) {
  const ref = React.useRef<HTMLDivElement>(null)
  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(null)

  React.useEffect(() => {
    if (ref.current && !editorRef.current) {
      editorRef.current = monaco.editor.create(ref.current, {
        value,
        language: 'markdown',
        automaticLayout: true,
      });
      if (onChange) {
        editorRef.current.onDidChangeModelContent(() => {
          const val = editorRef.current?.getValue() ?? '';
          onChange(val);
        });
      }
    }
    return () => {
      if (editorRef.current) {
        editorRef.current.dispose();
        editorRef.current = null;
      }
    };
  }, [])

  React.useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value])

  return <div ref={ref} className="w-1/2 h-full" />
}
