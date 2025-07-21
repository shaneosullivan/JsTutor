"use client";

import { useEffect, useRef, useImperativeHandle, forwardRef } from "react";
import { EditorView, basicSetup } from "codemirror";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { EditorState, StateField, StateEffect } from "@codemirror/state";
import { Decoration, DecorationSet } from "@codemirror/view";
import { useKeyboard } from "@/components/KeyboardProvider";
import { CodeEditorErrorBoundary } from "./code-editor-error-boundary";
import { formatCode, canFormatCode } from "@/lib/prettier-formatter";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  language?: string;
  className?: string;
  errorLine?: number;
  originalCode?: string;
  shouldFormat?: boolean; // Whether to format code on blur
}

export interface CodeEditorRef {
  formatCode: () => Promise<void>;
}

// Error line decoration
const errorLineMark = Decoration.line({
  attributes: { class: "cm-error-line" }
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
  provide: (f) => EditorView.decorations.from(f)
});

const CodeEditor = forwardRef<CodeEditorRef, CodeEditorProps>(function CodeEditor({
  value,
  onChange,
  className = "",
  errorLine,
  originalCode,
  shouldFormat = false
}, ref) {
  const keyboard = useKeyboard();
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);
  const lastCursorPosRef = useRef<number | null>(null);

  const handleReset = () => {
    if (originalCode) {
      onChange(originalCode);
    }
  };

  const calculateEditorCharacterWidth = (): number => {
    if (!viewRef.current) {
      return 80; // Default fallback
    }

    const view = viewRef.current;
    const editorRect = view.dom.getBoundingClientRect();
    
    // Get the approximate character width based on the monospace font
    // Create a temporary element to measure character width
    const measureElement = document.createElement('span');
    measureElement.style.font = "14px 'Fira Code', 'Monaco', 'Menlo', monospace";
    measureElement.style.visibility = 'hidden';
    measureElement.style.position = 'absolute';
    measureElement.textContent = 'M'.repeat(10); // Use 10 characters for better accuracy
    
    document.body.appendChild(measureElement);
    const charWidth = measureElement.getBoundingClientRect().width / 10;
    document.body.removeChild(measureElement);
    
    // Calculate how many characters can fit in the editor width
    // Subtract some padding for line numbers, scrollbars, etc.
    const usableWidth = editorRect.width - 60; // Account for line numbers and padding
    const maxChars = Math.floor(usableWidth / charWidth);
    
    // Return a reasonable minimum and maximum
    return Math.max(40, Math.min(maxChars, 120));
  };

  const performFormat = async () => {
    if (!viewRef.current) {
      return;
    }

    const currentCode = viewRef.current.state.doc.toString();
    if (!canFormatCode(currentCode)) {
      return;
    }

    try {
      const editorWidth = calculateEditorCharacterWidth();
      const formattedCode = await formatCode(currentCode, editorWidth);
      if (formattedCode !== currentCode) {
        onChange(formattedCode);
      }
    } catch (error) {
      console.warn("Failed to format code:", error);
    }
  };

  const handleBlur = async () => {
    if (!shouldFormat) {
      return;
    }
    await performFormat();
  };

  // Expose formatCode function to parent components
  useImperativeHandle(ref, () => ({
    formatCode: performFormat
  }), []);

  useEffect(() => {
    if (!editorRef.current) {
      return;
    }

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
        EditorView.domEventHandlers({
          blur: (_event, _view) => {
            handleBlur();
            return false;
          }
        }),
        EditorView.theme({
          "&": {
            fontSize: "14px",
            height: "100%"
          },
          ".cm-focused": {
            outline: "none"
          },
          ".cm-editor": {
            height: "100%"
          },
          ".cm-scroller": {
            fontFamily: "'Fira Code', 'Monaco', 'Menlo', monospace",
            lineHeight: "1.5"
          },
          ".cm-error-line": {
            backgroundColor: "rgba(239, 68, 68, 0.1)",
            borderLeft: "3px solid #ef4444"
          }
        })
      ]
    });

    viewRef.current = new EditorView({
      state,
      parent: editorRef.current
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
          insert: value
        }
      });
    }
  }, [value]);

  // Update error line highlighting
  useEffect(() => {
    if (viewRef.current) {
      viewRef.current.dispatch({
        effects: [setErrorLineEffect.of(errorLine || null)]
      });
    }
  }, [errorLine]);

  // Handle keyboard visibility changes and maintain cursor position
  useEffect(() => {
    if (!viewRef.current) {
      return;
    }

    const view = viewRef.current;

    // Save cursor position when keyboard becomes visible
    if (keyboard.isVisible && !lastCursorPosRef.current) {
      lastCursorPosRef.current = view.state.selection.main.head;
    }

    // When keyboard visibility changes, ensure cursor line is visible
    const handleResize = () => {
      requestAnimationFrame(() => {
        if (view && lastCursorPosRef.current !== null) {
          // Scroll to the cursor position
          const pos = lastCursorPosRef.current;
          const line = view.state.doc.lineAt(pos);

          // Calculate the pixel position of the line
          const coords = view.coordsAtPos(line.from);
          if (coords) {
            // Get the editor container height
            const editorRect = view.dom.getBoundingClientRect();
            const lineHeight = view.defaultLineHeight;

            // Calculate if we need to scroll to keep the line visible
            const scrollTop = view.scrollDOM.scrollTop;
            const visibleHeight = editorRect.height;
            const lineTop = coords.top - editorRect.top + scrollTop;

            // Keep the cursor line in the visible area, preferably in the middle third
            const targetTop = visibleHeight * 0.3; // 30% from top
            const newScrollTop = Math.max(0, lineTop - targetTop);

            if (Math.abs(newScrollTop - scrollTop) > lineHeight) {
              view.scrollDOM.scrollTop = newScrollTop;
            }
          }
        }
      });
    };

    // Add resize observer to handle layout changes
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(view.dom);

    // Clear saved position when keyboard is hidden
    if (!keyboard.isVisible) {
      lastCursorPosRef.current = null;
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, [keyboard.isVisible, keyboard.visibleHeight]);

  return (
    <CodeEditorErrorBoundary
      originalCode={originalCode || value}
      onReset={handleReset}
    >
      <div
        ref={editorRef}
        className={`${className} ${keyboard.isVisible ? "keyboard-active" : ""}`}
      />
    </CodeEditorErrorBoundary>
  );
});

export default CodeEditor;
