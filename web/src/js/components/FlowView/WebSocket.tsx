import type { HTTPFlow, WebSocketData } from "../../flow";
import * as React from "react";
import { formatTimeStamp } from "../../utils";
import Messages from "./Messages";
import { XSquare } from "lucide-react";

export default function WebSocket({
    flow,
}: {
    flow: HTTPFlow & { websocket: WebSocketData };
}) {
    return (
        <section className="p-4 space-y-4">
            <h4 className="text-sm font-semibold">WebSocket</h4>
            <Messages
                flow={flow}
                messages_meta={flow.websocket.messages_meta}
            />
            <CloseSummary websocket={flow.websocket} />
        </section>
    );
}
WebSocket.displayName = "WebSocket";

function CloseSummary({ websocket }: { websocket: WebSocketData }) {
    if (!websocket.timestamp_end) return null;
    const reason = websocket.close_reason ? `(${websocket.close_reason})` : "";
    return (
        <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-1">
                <XSquare className="h-4 w-4 text-muted-foreground" />
                Closed by {websocket.closed_by_client ? "client" : "server"}{" "}
                with code {websocket.close_code} {reason}.
            </span>
            <span className="text-xs text-muted-foreground">
                {formatTimeStamp(websocket.timestamp_end)}
            </span>
        </div>
    );
}
