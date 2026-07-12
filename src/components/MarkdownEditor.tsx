import { css } from '@codemirror/lang-css';
import { markdown } from '@codemirror/lang-markdown';
import CodeMirror from '@uiw/react-codemirror';
import { EditorView } from '@codemirror/view';
import { useI18n } from '../i18n';

const editorTheme = EditorView.theme({
  '&': { height: '100%', backgroundColor: 'var(--app-surface)', color: 'var(--app-text-secondary)' },
  '.cm-scroller': { fontFamily: '"SFMono-Regular", Consolas, "Liberation Mono", monospace', fontSize: '13px', lineHeight: '1.75' },
  '.cm-content': { padding: '14px 0 80px' },
  '.cm-line': { padding: '0 12px' },
  '.cm-gutters': { backgroundColor: 'var(--app-surface-subtle)', color: 'var(--app-text-muted)', borderRight: '1px solid var(--app-border)' },
  '.cm-lineNumbers .cm-gutterElement': { minWidth: '30px', padding: '0 7px 0 4px' },
  '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: 'var(--app-surface-subtle)' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection': { backgroundColor: 'var(--app-selection)' },
  '.cm-cursor, .cm-dropCursor': { borderLeftColor: 'var(--app-primary)' },
  '.cm-foldGutter': { width: '10px' },
  '&.cm-focused': { outline: 'none' },
});

interface SourceEditorProps {
  value: string;
  onChange: (value: string) => void;
  ariaLabel: string;
  language: ReturnType<typeof markdown>;
}

function SourceEditor({ value, onChange, ariaLabel, language }: SourceEditorProps) {
  return (
    <CodeMirror
      aria-label={ariaLabel}
      className="code-editor"
      value={value}
      height="100%"
      extensions={[language, EditorView.lineWrapping, editorTheme]}
      basicSetup={{
        lineNumbers: true,
        foldGutter: true,
        highlightActiveLine: false,
        highlightActiveLineGutter: false,
        autocompletion: false,
      }}
      onChange={onChange}
    />
  );
}

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
}

export function MarkdownEditor(props: EditorProps) {
  const { m } = useI18n();
  return <SourceEditor {...props} ariaLabel={m.markdownEditor} language={markdown()} />;
}

export function CssEditor(props: EditorProps) {
  const { m } = useI18n();
  return <SourceEditor {...props} ariaLabel={m.cssEditor} language={css()} />;
}
