"use client";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";
import { EditorView } from "@codemirror/view";
import { EditorState } from "@codemirror/state";
import { javascript } from "@codemirror/lang-javascript";

interface CodeBlockProps {
  code: string;
  language?: string;
}

function CodeBlock({ code, language = "javascript" }: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const editorRef = useRef<HTMLDivElement>(null);
  const viewRef = useRef<EditorView | null>(null);

  useEffect(() => {
    if (editorRef.current && !viewRef.current) {
      const state = EditorState.create({
        doc: code,
        extensions: [
          javascript(),
          EditorView.theme({
            "&": {
              fontSize: "14px",
              fontFamily:
                'ui-monospace, SFMono-Regular, "SF Mono", Consolas, "Liberation Mono", Menlo, monospace',
              backgroundColor: "#1e293b"
            },
            ".cm-content": {
              padding: "12px",
              minHeight: "60px",
              color: "#e2e8f0"
            },
            ".cm-focused": {
              outline: "none"
            },
            ".cm-editor": {
              borderRadius: "6px"
            },
            ".cm-keyword": {
              color: "#c084fc"
            },
            ".cm-string": {
              color: "#86efac"
            },
            ".cm-number": {
              color: "#fbbf24"
            },
            ".cm-comment": {
              color: "#6b7280",
              fontStyle: "italic"
            },
            ".cm-variableName": {
              color: "#60a5fa"
            },
            ".cm-propertyName": {
              color: "#f472b6"
            },
            ".cm-operator": {
              color: "#fb7185"
            },
            ".cm-punctuation": {
              color: "#e2e8f0"
            }
          }),
          EditorView.editable.of(false),
          EditorView.lineWrapping
        ]
      });

      viewRef.current = new EditorView({
        state,
        parent: editorRef.current
      });
    }

    return () => {
      if (viewRef.current) {
        viewRef.current.destroy();
        viewRef.current = null;
      }
    };
  }, [code]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <div className="relative bg-slate-900 rounded-lg my-3 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-slate-800 border-b border-slate-700">
        <span className="text-xs font-medium text-slate-300 uppercase tracking-wide">
          {language}
        </span>
        <Button
          onClick={copyToClipboard}
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-slate-300 hover:text-white hover:bg-slate-700"
        >
          {copied ? (
            <>
              <Check className="w-3 h-3 mr-1" />
              Copied
            </>
          ) : (
            <>
              <Copy className="w-3 h-3 mr-1" />
              Copy
            </>
          )}
        </Button>
      </div>
      <div ref={editorRef} className="text-sm" />
    </div>
  );
}

interface MessageContentProps {
  content: string;
}

function InlineCode({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy code:", err);
    }
  };

  return (
    <span className="relative inline-block group">
      <code
        className="bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded text-sm font-mono cursor-pointer hover:bg-slate-200 transition-colors"
        onClick={copyToClipboard}
        title="Click to copy code"
      >
        {code}
      </code>
      <button
        onClick={copyToClipboard}
        className="absolute -right-1 top-1/2 -translate-y-1/2 translate-x-full opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded bg-white shadow-md border border-slate-200 hover:bg-slate-50"
        title="Copy code"
      >
        {copied ? (
          <Check className="w-3 h-3 text-green-600" />
        ) : (
          <Copy className="w-3 h-3 text-slate-500" />
        )}
      </button>
    </span>
  );
}

interface ContentPart {
  type: "text" | "code-block" | "inline-code";
  content: string;
}

export default function MessageContent({ content }: MessageContentProps) {
  // Process the content to handle both code blocks and inline code
  const processContent = (text: string): ContentPart[] => {
    const parts: ContentPart[] = [];

    // First, extract code blocks (triple backticks) and replace with placeholders
    const codeBlockRegex = /```(?:javascript|js)?\n([\s\S]*?)```/g;
    const codeBlocks: string[] = [];
    let tempText = text;
    let match;

    while ((match = codeBlockRegex.exec(text)) !== null) {
      const placeholder = `__CODEBLOCK_${codeBlocks.length}__`;
      codeBlocks.push(match[1].trim());
      tempText = tempText.replace(match[0], placeholder);
    }

    // Now split by code block placeholders and process each part for inline code
    const segments = tempText.split(/(__CODEBLOCK_\d+__)/);

    segments.forEach((segment) => {
      const codeBlockMatch = segment.match(/^__CODEBLOCK_(\d+)__$/);
      if (codeBlockMatch) {
        // This is a code block placeholder
        const blockIndex = parseInt(codeBlockMatch[1]);
        parts.push({ type: "code-block", content: codeBlocks[blockIndex] });
      } else {
        // Process this segment for inline code
        const inlineCodeRegex = /`([^`]+)`/g;
        const textParts: ContentPart[] = [];
        let lastIndex = 0;
        let inlineMatch;

        while ((inlineMatch = inlineCodeRegex.exec(segment)) !== null) {
          if (inlineMatch.index > lastIndex) {
            textParts.push({
              type: "text",
              content: segment.slice(lastIndex, inlineMatch.index)
            });
          }
          textParts.push({ type: "inline-code", content: inlineMatch[1] });
          lastIndex = inlineMatch.index + inlineMatch[0].length;
        }

        if (lastIndex < segment.length) {
          textParts.push({ type: "text", content: segment.slice(lastIndex) });
        }

        if (textParts.length === 0 && segment) {
          textParts.push({ type: "text", content: segment });
        }

        parts.push(...textParts);
      }
    });

    return parts;
  };

  const parts = processContent(content);

  if (parts.length === 0) {
    return <p className="text-sm whitespace-pre-wrap">{content}</p>;
  }

  return (
    <div>
      {parts.map((part, index) => {
        if (part.type === "code-block") {
          return <CodeBlock key={index} code={part.content} />;
        } else if (part.type === "inline-code") {
          return <InlineCode key={index} code={part.content} />;
        } else {
          return part.content ? (
            <span key={index} className="whitespace-pre-wrap">
              {part.content}
            </span>
          ) : null;
        }
      })}
    </div>
  );
}
