import type { Flow, MessagesMeta } from "../../flow";
import { useAppDispatch, useAppSelector } from "../../ducks";
import * as React from "react";
import { useCallback, useState } from "react";
import type { ContentViewData } from "../contentviews/useContentView";
import { useContentView } from "../contentviews/useContentView";
import ViewSelector from "../contentviews/ViewSelector";
import { setContentViewFor } from "../../ducks/ui/flow";
import { formatTimeStamp } from "../../utils";
import ContentRenderer from "../contentviews/ContentRenderer";
import { ArrowRight, ArrowLeft } from "lucide-react";

type MessagesPropTypes = {
    flow: Flow;
    messages_meta: MessagesMeta;
};

export default function Messages({ flow, messages_meta }: MessagesPropTypes) {
    const dispatch = useAppDispatch();

    const contentView = useAppSelector(
        (state) => state.ui.flow.contentViewFor[flow.id + "messages"] || "Auto",
    );
    const [maxLines, setMaxLines] = useState<number>(
        useAppSelector((state) => state.options.content_view_lines_cutoff),
    );
    const showMore = useCallback(
        () => setMaxLines(Math.max(1024, maxLines * 2)),
        [maxLines],
    );
    const messages =
        useContentView(
            flow,
            "messages",
            contentView,
            maxLines + 1,
            flow.id + messages_meta.count,
        ) ?? [];

    let remainingLines = maxLines;

    return (
        <div className="p-4 space-y-4">
            <div className="flex items-center justify-between gap-4 pb-2 border-b border-border">
                <h5 className="text-sm font-medium">{messages_meta.count} Messages</h5>
                <ViewSelector
                    value={contentView}
                    onChange={(cv) =>
                        dispatch(
                            setContentViewFor({
                                messageId: flow.id + "messages",
                                contentView: cv,
                            }),
                        )
                    }
                />
            </div>
            {messages.map((d: ContentViewData, i) => {
                const ArrowIcon = d.from_client ? ArrowRight : ArrowLeft;
                const iconClass = d.from_client ? "text-blue-500" : "text-red-500";
                const renderer = (
                    <div key={i} className="space-y-1">
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <ArrowIcon className={`h-4 w-4 ${iconClass}`} />
                            <span>
                                {d.timestamp && formatTimeStamp(d.timestamp)}
                            </span>
                        </div>
                        <ContentRenderer
                            content={d.text}
                            maxLines={remainingLines}
                            showMore={showMore}
                        />
                    </div>
                );
                remainingLines -= d.text.split("\n").length;
                return renderer;
            })}
        </div>
    );
}
