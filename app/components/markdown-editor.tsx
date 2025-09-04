import * as React from "react"
import * as monaco from 'monaco-editor';

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
