import { useEffect, useRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState, StateField, StateEffect } from "@codemirror/state";
import { Decoration, DecorationSet } from "@codemirror/view";
import { CodeEditorErrorBoundary } from "./code-editor-error-boundary";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  className?: string;
  errorLine?: number;
  originalCode?: string;
}

// Error line decoration
const errorLineMark = Decoration.line({
  attributes: { class: "cm-error-line" },
});

// State effect for setting error line
const setErrorLineEffect = StateEffect.define<number | null>();

// State field for tracking error line
const errorLineField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, tr) {
    decorations = decorations.map(tr.changes);
    for (const effect of tr.effects) {
      if (effect.is(setErrorLineEffect)) {
        if (effect.value === null) {
          decorations = Decoration.none;
        } else {
          const lineNumber = effect.value;
          if (lineNumber >= 1 && lineNumber <= tr.state.doc.lines) {
            const line = tr.state.doc.line(lineNumber);
            decorations = Decoration.set([errorLineMark.range(line.from)]);
          } else {
            decorations = Decoration.none;
          }
        }
      }
    }
    return decorations;
  },
  provide: (f) => EditorView.decorations.from(f),
});

export default function CodeEditor({
  value,
  onChange,
  language = "javascript",
  className = "",
  errorLine,
  originalCode,
}: CodeEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  const handleReset = () => {
    if (originalCode) {
      onChange(originalCode);
    }
  };

  useEffect(() => {
    if (!editorRef.current) return;

    const state = EditorState.create({
      doc: value,
      extensions: [
        basicSetup,
        javascript(),
        oneDark,
        errorLineField,
        EditorView.updateListener.of((update) => {
          if (update.docChanged) {
            onChange(update.state.doc.toString());
          }
        }),
        EditorView.theme({
          "&": {
            fontSize: "14px",
            height: "100%",
          },
          ".cm-focused": {
            outline: "none",
          },
          ".cm-editor": {
            height: "100%",
          },
          ".cm-scroller": {
            fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace",
            lineHeight: "1.5",
          },
          ".cm-error-line": {
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderLeft: "3px solid #ef4444",
          },
        }),
      ],
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current,
    });

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (viewRef.current && value !== viewRef.current.state.doc.toString()) {
      viewRef.current.dispatch({
        changes: {
          from: 0,
          to: viewRef.current.state.doc.length,
          insert: value,
        },
      });
    }
  }, [value]);

  // Update error line highlighting
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: [setErrorLineEffect.of(errorLine || null)],
      });
    }
  }, [errorLine]);

  return (
    <CodeEditorErrorBoundary
      originalCode={originalCode || value}
      onReset={handleReset}
    >
      <div ref={editorRef} className={className} />
    </CodeEditorErrorBoundary>
  );
}
