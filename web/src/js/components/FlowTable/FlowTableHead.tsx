import * as React from "react";
import { useState, useRef, useCallback } from "react";
import FlowColumns from "./FlowColumns";
import { setSort } from "../../ducks/flows";
import { useAppDispatch, useAppSelector } from "../../ducks";
import { isValidColumnName } from "../../flow/utils";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, GripVertical } from "lucide-react";

export default React.memo(function FlowTableHead() {
    const dispatch = useAppDispatch();
    const sortDesc = useAppSelector((state) => state.flows.sort.desc);
    const sortColumn = useAppSelector((state) => state.flows.sort.column);
    const displayColumnNames = useAppSelector(
        (state) => state.options.web_columns,
    );

    const displayColumns = displayColumnNames
        .filter(isValidColumnName)
        .concat("quickactions");

    const [columnWidths, setColumnWidths] = useState<{ [key: string]: number }>({});
    const [resizing, setResizing] = useState<{ column: string; startX: number; startWidth: number } | null>(null);

    const handleResizeStart = useCallback((e: React.MouseEvent, colName: string) => {
        e.stopPropagation();
        const th = (e.currentTarget as HTMLElement).parentElement as HTMLTableCellElement;
        setResizing({
            column: colName,
            startX: e.clientX,
            startWidth: th.offsetWidth,
        });
    }, []);

    const handleResizeMove = useCallback((e: MouseEvent) => {
        if (resizing) {
            const diff = e.clientX - resizing.startX;
            const newWidth = Math.max(50, resizing.startWidth + diff);
            setColumnWidths(prev => ({ ...prev, [resizing.column]: newWidth }));
        }
    }, [resizing]);

    const handleResizeEnd = useCallback(() => {
        setResizing(null);
    }, []);

    React.useEffect(() => {
        if (resizing) {
            document.addEventListener('mousemove', handleResizeMove);
            document.addEventListener('mouseup', handleResizeEnd);
            return () => {
                document.removeEventListener('mousemove', handleResizeMove);
                document.removeEventListener('mouseup', handleResizeEnd);
            };
        }
    }, [resizing, handleResizeMove, handleResizeEnd]);

    return (
        <tr className="border-b border-border">
            {displayColumns.map((colName) => (
                <th
                    className={cn(
                        "h-10 px-2 text-left align-middle font-medium text-muted-foreground relative",
                        "cursor-pointer select-none hover:bg-muted/50 transition-colors",
                        sortColumn === colName && "text-foreground",
                    )}
                    key={colName}
                    style={columnWidths[colName] ? { width: columnWidths[colName] } : undefined}
                    onClick={() =>
                        dispatch(
                            setSort({
                                column:
                                    colName === sortColumn && sortDesc
                                        ? undefined
                                        : colName,
                                desc:
                                    colName !== sortColumn ? false : !sortDesc,
                            }),
                        )
                    }
                >
                    <div className="flex items-center gap-1">
                        {FlowColumns[colName].headerName}
                        {sortColumn === colName && (
                            sortDesc ? (
                                <ChevronDown className="h-3 w-3" />
                            ) : (
                                <ChevronUp className="h-3 w-3" />
                            )
                        )}
                    </div>
                    {colName !== "quickactions" && (
                        <div
                            className="absolute right-0 top-0 h-full w-1 cursor-col-resize hover:bg-primary/50 flex items-center justify-center group"
                            onMouseDown={(e) => handleResizeStart(e, colName)}
                        >
                            <GripVertical className="h-3 w-3 opacity-0 group-hover:opacity-100 text-primary" />
                        </div>
                    )}
                </th>
            ))}
        </tr>
    );
});
