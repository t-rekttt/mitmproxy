import * as React from "react";
import { useCallback, useMemo } from "react";
import CodeMirror from "@uiw/react-codemirror";
import { EditorView } from "@codemirror/view";
import { css } from "@codemirror/lang-css";
import { html } from "@codemirror/lang-html";
import { javascript } from "@codemirror/lang-javascript";
import { yaml } from "@codemirror/lang-yaml";
import { SyntaxHighlight } from "../../backends/consts";

const darkTheme = EditorView.theme(
    {
        "&": {
            color: "hsl(var(--foreground))",
            backgroundColor: "hsl(var(--background))",
        },
        ".cm-content": {
            caretColor: "hsl(var(--foreground))",
        },
        "&.cm-focused .cm-cursor": {
            borderLeftColor: "hsl(var(--foreground))",
        },
        "&.cm-focused .cm-selectionBackground, ::selection": {
            backgroundColor: "hsl(var(--accent))",
        },
        ".cm-gutters": {
            backgroundColor: "hsl(var(--muted))",
            color: "hsl(var(--muted-foreground))",
            border: "none",
        },
    },
    { dark: true },
);

type CodeEditorProps = {
    initialContent: string;
    onChange: (content: string) => void;
    readonly?: boolean;
    language?: SyntaxHighlight | null;
};

export default function CodeEditor({
    initialContent,
    onChange,
    language,
    readonly = false,
}: CodeEditorProps) {
    const stopPropagation = useCallback(
        (e: React.KeyboardEvent<HTMLDivElement>) => e.stopPropagation(),
        [],
    );
    const extensions = useMemo(() => {
        switch (language) {
            case SyntaxHighlight.YAML:
                return [yaml()];
            case SyntaxHighlight.XML:
                return [html()];
            case SyntaxHighlight.JAVASCRIPT:
                return [javascript()];
            case SyntaxHighlight.CSS:
                return [css()];
            case undefined:
            case null:
            case SyntaxHighlight.NONE:
            case SyntaxHighlight.ERROR:
                return [];
            /* istanbul ignore next @preserve */
            default: {
                const unexpected: never = language;
                console.error(
                    "Unexpected syntax highlighting language: ",
                    unexpected,
                );
                return [];
            }
        }
    }, [language]);
    return (
        <div className="mb-3" onKeyDown={stopPropagation}>
            <CodeMirror
                value={initialContent}
                onChange={onChange}
                readOnly={readonly}
                extensions={extensions}
                theme={darkTheme}
            />
        </div>
    );
}
