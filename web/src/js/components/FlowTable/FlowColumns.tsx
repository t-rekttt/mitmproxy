import type { ReactElement } from "react";
import React, { type JSX } from "react";
import { useAppDispatch, useAppSelector } from "../../ducks";
import classnames from "classnames";
import type { sortFunctions } from "../../flow/utils";
import {
    canReplay,
    endTime,
    getTotalSize,
    startTime,
    getIcon,
    mainPath,
    statusCode,
    getMethod,
    getVersion,
    type FlowIconType,
} from "../../flow/utils";
import { formatSize, formatTimeDelta, formatTimeStamp } from "../../utils";
import * as flowActions from "../../ducks/flows";
import type { Flow } from "../../flow";
import {
    X,
    AlertTriangle,
    RefreshCw,
    Pause,
    Play,
    FileText,
    FileCode,
    File,
    Image,
    FileCheck,
    Forward,
    Radio,
    Network,
    Wifi,
    Globe,
    Zap,
    Braces,
    Lock,
} from "lucide-react";

type FlowColumnProps = {
    flow: Flow;
};

interface FlowColumn {
    (props: FlowColumnProps): JSX.Element;

    headerName: string; // Shown in the UI
}

function FlowIcon({ iconType }: { iconType: FlowIconType }) {
    const iconClass = "h-4 w-4";
    switch (iconType) {
        case "css":
            return <Braces className={classnames(iconClass, "text-purple-500")} />;
        case "document":
            return <FileText className={classnames(iconClass, "text-blue-500")} />;
        case "js":
            return <FileCode className={classnames(iconClass, "text-yellow-500")} />;
        case "plain":
            return <File className={classnames(iconClass, "text-muted-foreground")} />;
        case "image":
            return <Image className={classnames(iconClass, "text-green-500")} />;
        case "not-modified":
            return <FileCheck className={classnames(iconClass, "text-gray-400")} />;
        case "redirect":
            return <Forward className={classnames(iconClass, "text-orange-500")} />;
        case "websocket":
            return <Radio className={classnames(iconClass, "text-cyan-500")} />;
        case "tcp":
            return <Network className={classnames(iconClass, "text-blue-400")} />;
        case "udp":
            return <Wifi className={classnames(iconClass, "text-indigo-400")} />;
        case "dns":
            return <Globe className={classnames(iconClass, "text-teal-500")} />;
        case "quic":
            return <Zap className={classnames(iconClass, "text-amber-500")} />;
        default:
            return <File className={classnames(iconClass, "text-muted-foreground")} />;
    }
}

export const tls: FlowColumn = ({ flow }) => {
    return (
        <td className="w-4 text-center">
            {flow.client_conn.tls_established && (
                <Lock className="h-3 w-3 text-green-500 inline-block" />
            )}
        </td>
    );
};
tls.headerName = "";

export const index: FlowColumn = ({ flow }) => {
    const index = useAppSelector(
        (state) => state.flows._listIndex.get(flow.id)!,
    );
    return <td className="w-12 text-right text-muted-foreground pr-2">{index + 1}</td>;
};
index.headerName = "#";

export const icon: FlowColumn = ({ flow }) => {
    return (
        <td className="w-6 text-center">
            <FlowIcon iconType={getIcon(flow)} />
        </td>
    );
};
icon.headerName = "";

export const path: FlowColumn = ({ flow }) => {
    let err;
    if (flow.error) {
        if (flow.error.msg === "Connection killed.") {
            err = <X className="h-3 w-3 inline-block ml-1 text-destructive" />;
        } else {
            err = <AlertTriangle className="h-3 w-3 inline-block ml-1 text-warning" />;
        }
    }
    return (
        <td className="max-w-xs truncate">
            <span className="flex items-center gap-1">
                {flow.marked && <span className="text-xs">{flow.marked}</span>}
                {flow.is_replay === "request" && (
                    <RefreshCw className="h-3 w-3 text-blue-500" />
                )}
                {flow.intercepted && <Pause className="h-3 w-3 text-orange-500" />}
                {err}
                <span className="truncate">{mainPath(flow)}</span>
            </span>
        </td>
    );
};
path.headerName = "Path";

export const method: FlowColumn = ({ flow }) => (
    <td className="w-16 font-medium">{getMethod(flow)}</td>
);
method.headerName = "Method";

export const version: FlowColumn = ({ flow }) => (
    <td className="w-16 text-muted-foreground">{getVersion(flow)}</td>
);
version.headerName = "Version";

export const status: FlowColumn = ({ flow }) => {
    let colorClass = "text-destructive";

    if ((flow.type !== "http" && flow.type != "dns") || !flow.response)
        return <td className="w-12" />;

    if (100 <= flow.response.status_code && flow.response.status_code < 200) {
        colorClass = "text-green-500";
    } else if (
        200 <= flow.response.status_code &&
        flow.response.status_code < 300
    ) {
        colorClass = "text-green-600";
    } else if (
        300 <= flow.response.status_code &&
        flow.response.status_code < 400
    ) {
        colorClass = "text-blue-400";
    } else if (
        400 <= flow.response.status_code &&
        flow.response.status_code < 500
    ) {
        colorClass = "text-red-500";
    } else if (
        500 <= flow.response.status_code &&
        flow.response.status_code < 600
    ) {
        colorClass = "text-red-500";
    }

    return (
        <td className={classnames("w-12 font-medium", colorClass)}>
            {statusCode(flow)}
        </td>
    );
};
status.headerName = "Status";

export const size: FlowColumn = ({ flow }) => {
    return <td className="w-16 text-right text-muted-foreground">{formatSize(getTotalSize(flow))}</td>;
};
size.headerName = "Size";

export const time: FlowColumn = ({ flow }) => {
    const start = startTime(flow);
    const end = endTime(flow);
    return (
        <td className="w-16 text-right text-muted-foreground">
            {start && end ? formatTimeDelta(1000 * (end - start)) : "..."}
        </td>
    );
};
time.headerName = "Time";

export const timestamp: FlowColumn = ({ flow }) => {
    const start = startTime(flow);
    return (
        <td className="w-24 text-muted-foreground text-xs">
            {start ? formatTimeStamp(start) : "..."}
        </td>
    );
};
timestamp.headerName = "Start time";

export const quickactions: FlowColumn = ({ flow }) => {
    const dispatch = useAppDispatch();

    let resume_or_replay: ReactElement<any> | null = null;
    if (flow.intercepted) {
        resume_or_replay = (
            <a
                href="#"
                className="hover:opacity-80"
                onClick={(e) => {
                    e.preventDefault();
                    dispatch(flowActions.resume([flow]));
                }}
            >
                <Play className="h-4 w-4 text-green-500" />
            </a>
        );
    } else if (canReplay(flow)) {
        resume_or_replay = (
            <a
                href="#"
                className="hover:opacity-80"
                onClick={(e) => {
                    e.preventDefault();
                    dispatch(flowActions.replay([flow]));
                }}
            >
                <RefreshCw className="h-4 w-4 text-blue-500" />
            </a>
        );
    }

    return (
        <td className="w-8 text-center" data-column="quickactions">
            {resume_or_replay ? <div>{resume_or_replay}</div> : <></>}
        </td>
    );
};
quickactions.headerName = "";

export const comment: FlowColumn = ({ flow }) => {
    const text = flow.comment;
    return <td className="max-w-xs truncate text-muted-foreground">{text}</td>;
};
comment.headerName = "Comment";

const FlowColumns: { [key in keyof typeof sortFunctions]: FlowColumn } = {
    // parsed by web/gen/web_columns
    icon,
    index,
    method,
    version,
    path,
    quickactions,
    size,
    status,
    time,
    timestamp,
    tls,
    comment,
};
export default FlowColumns;
