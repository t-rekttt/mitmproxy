import React from "react";
import { ChevronsDown } from "lucide-react";

type ContentRendererProps = {
    content: string;
    maxLines: number;
    showMore: () => void;
};

const ContentRenderer = React.memo(function ContentRenderer({
    content,
    maxLines,
    showMore,
}: ContentRendererProps) {
    if (content.length === 0) {
        return null;
    }
    return (
        <pre>
            {content.split("\n").map((line, i) =>
                i === maxLines ? (
                    <button
                        key="showmore"
                        onClick={showMore}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium rounded bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        <ChevronsDown className="h-3 w-3 mr-1" aria-hidden="true" />
                        Show more
                    </button>
                ) : (
                    <div key={i}>{line}</div>
                ),
            )}
        </pre>
    );
});
export default ContentRenderer;
