import React, { useCallback } from "react";
import type { Flow } from "../../flow";
import { useAppDispatch, useAppSelector } from "../../ducks";
import { select, selectRange, selectToggle } from "../../ducks/flows";
import * as columns from "./FlowColumns";
import { cn } from "@/lib/utils";

type FlowRowProps = {
    flow: Flow;
    selected: boolean;
    highlighted: boolean;
};

export default React.memo(function FlowRow({
    flow,
    selected,
    highlighted,
}: FlowRowProps) {
    const dispatch = useAppDispatch();
    const displayColumnNames = useAppSelector(
        (state) => state.options.web_columns,
    );

    const onClick = useCallback(
        (e: React.MouseEvent<HTMLTableRowElement>) => {
            // a bit of a hack to disable row selection for quickactions.
            let node = e.target as HTMLElement;
            while (node.parentNode) {
                if (node.getAttribute("data-column") === "quickactions") return;
                node = node.parentNode as HTMLElement;
            }
            if (e.metaKey || e.ctrlKey) {
                dispatch(selectToggle(flow));
            } else if (e.shiftKey) {
                window.getSelection()?.empty();
                dispatch(selectRange(flow));
            } else {
                dispatch(select([flow]));
            }
        },
        [flow],
    );

    const displayColumns = displayColumnNames
        .map((x) => columns[x])
        .filter((x) => x)
        .concat(columns.quickactions);

    return (
        <tr
            className={cn(
                "h-8 border-b border-border cursor-pointer transition-colors",
                "hover:bg-muted/50",
                selected && "bg-flow-selected hover:bg-flow-selected/90",
                highlighted && !selected && "bg-flow-highlighted",
                flow.intercepted && "border-l-2 border-l-flow-intercept",
            )}
            onClick={onClick}
        >
            {displayColumns.map((Column) => (
                <Column key={Column.name} flow={flow} />
            ))}
        </tr>
    );
});
