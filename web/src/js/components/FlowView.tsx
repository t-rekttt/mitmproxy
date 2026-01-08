import * as React from "react";
import type { FunctionComponent } from "react";
import { Request, Response } from "./FlowView/HttpMessages";
import {
    Request as DnsRequest,
    Response as DnsResponse,
} from "./FlowView/DnsMessages";
import Connection from "./FlowView/Connection";
import Error from "./FlowView/Error";
import Timing from "./FlowView/Timing";
import WebSocket from "./FlowView/WebSocket";
import Comment from "./FlowView/Comment";
import { selectTab } from "../ducks/ui/flow";
import { useAppDispatch, useAppSelector } from "../ducks";
import type { Flow } from "../flow";
import TcpMessages from "./FlowView/TcpMessages";
import UdpMessages from "./FlowView/UdpMessages";
import * as flowsActions from "../ducks/flows";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

type TabProps = {
    flow: Flow;
};

export const allTabs: {
    [name: string]: FunctionComponent<TabProps> & { displayName: string };
} = {
    request: Request,
    response: Response,
    error: Error,
    connection: Connection,
    timing: Timing,
    websocket: WebSocket,
    tcpmessages: TcpMessages,
    udpmessages: UdpMessages,
    dnsrequest: DnsRequest,
    dnsresponse: DnsResponse,
    comment: Comment,
};

export function tabsForFlow(flow: Flow): string[] {
    let tabs;
    switch (flow.type) {
        case "http":
            tabs = ["request", "response", "websocket"].filter((k) => flow[k]);
            break;
        case "tcp":
            tabs = ["tcpmessages"];
            break;
        case "udp":
            tabs = ["udpmessages"];
            break;
        case "dns":
            tabs = ["request", "response"]
                .filter((k) => flow[k])
                .map((s) => "dns" + s);
            break;
    }

    if (flow.error) tabs.push("error");
    tabs.push("connection");
    tabs.push("timing");
    tabs.push("comment");
    return tabs;
}

export default function FlowView() {
    const dispatch = useAppDispatch();
    const flow = useAppSelector((state) => state.flows.selected[0]);
    let active = useAppSelector((state) => state.ui.flow.tab);

    if (flow == undefined) {
        return <></>;
    }

    const tabs = tabsForFlow(flow);

    if (tabs.indexOf(active) < 0) {
        if (active === "response" && flow.error) {
            active = "error";
        } else if (active === "error" && "response" in flow) {
            active = "response";
        } else {
            active = tabs[0];
        }
    }
    const Tab = allTabs[active];

    return (
        <div className="flex flex-col flex-1 min-h-0 border-t border-border">
            <nav className="flex items-center h-10 px-2 border-b border-border bg-card gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => dispatch(flowsActions.select([]))}
                    data-testid="close-button-id"
                >
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
                <div className="flex items-center gap-1 border-l border-border pl-2 ml-1">
                    {tabs.map((tabId) => (
                        <button
                            key={tabId}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                active === tabId
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground",
                            )}
                            onClick={(event) => {
                                event.preventDefault();
                                dispatch(selectTab(tabId));
                            }}
                        >
                            {allTabs[tabId].displayName}
                        </button>
                    ))}
                </div>
            </nav>
            <div className="flex-1 overflow-auto p-2">
                <Tab flow={flow} />
            </div>
        </div>
    );
}
