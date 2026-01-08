import * as React from "react";
import { formatSize } from "../utils";
import HideInStatic from "../components/common/HideInStatic";
import { useAppSelector } from "../ducks";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function Footer() {
    const version = useAppSelector((state) => state.backendState.version);
    const {
        mode,
        intercept,
        showhost,
        upstream_cert,
        rawtcp,
        http2,
        websocket,
        anticache,
        anticomp,
        stickyauth,
        stickycookie,
        stream_large_bodies,
        listen_host,
        listen_port,
        server,
        ssl_insecure,
    } = useAppSelector((state) => state.options);

    return (
        <footer
            className={cn(
                "flex-shrink-0 flex items-center justify-between",
                "px-2 py-1.5 border-t border-border bg-card",
                "text-xs",
            )}
        >
            <div className="flex items-center gap-1.5 flex-wrap">
                {mode && (mode.length !== 1 || mode[0] !== "regular") && (
                    <Badge variant="success" className="text-xs">
                        {mode.join(",")}
                    </Badge>
                )}
                {intercept && (
                    <Badge variant="success" className="text-xs">
                        Intercept: {intercept}
                    </Badge>
                )}
                {ssl_insecure && (
                    <Badge variant="destructive" className="text-xs">
                        ssl_insecure
                    </Badge>
                )}
                {showhost && (
                    <Badge variant="success" className="text-xs">
                        showhost
                    </Badge>
                )}
                {!upstream_cert && (
                    <Badge variant="success" className="text-xs">
                        no-upstream-cert
                    </Badge>
                )}
                {!rawtcp && (
                    <Badge variant="success" className="text-xs">
                        no-raw-tcp
                    </Badge>
                )}
                {!http2 && (
                    <Badge variant="success" className="text-xs">
                        no-http2
                    </Badge>
                )}
                {!websocket && (
                    <Badge variant="success" className="text-xs">
                        no-websocket
                    </Badge>
                )}
                {anticache && (
                    <Badge variant="success" className="text-xs">
                        anticache
                    </Badge>
                )}
                {anticomp && (
                    <Badge variant="success" className="text-xs">
                        anticomp
                    </Badge>
                )}
                {stickyauth && (
                    <Badge variant="success" className="text-xs">
                        stickyauth: {stickyauth}
                    </Badge>
                )}
                {stickycookie && (
                    <Badge variant="success" className="text-xs">
                        stickycookie: {stickycookie}
                    </Badge>
                )}
                {stream_large_bodies && (
                    <Badge variant="success" className="text-xs">
                        stream: {formatSize(stream_large_bodies)}
                    </Badge>
                )}
            </div>
            <div className="flex items-center gap-1.5">
                <HideInStatic>
                    {server && (
                        <Badge
                            variant="info"
                            className="text-xs"
                            title="HTTP Proxy Server Address"
                        >
                            {listen_host || "*"}:{listen_port || 8080}
                        </Badge>
                    )}
                </HideInStatic>
                <Badge
                    variant="secondary"
                    className="text-xs"
                    title="Mitmproxy Version"
                >
                    mitmproxy {version}
                </Badge>
            </div>
        </footer>
    );
}
