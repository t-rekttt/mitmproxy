import * as React from "react";
import { useEffect, useRef } from "react";
import type { ServerInfo } from "../../ducks/backendState";
import { formatAddress } from "../../utils";
import QRCode from "qrcode";
import { cn } from "@/lib/utils";

export default function CaptureSetup() {
    return (
        <div className="p-6">
            <h3 className="text-lg font-semibold mb-2">mitmproxy is running.</h3>
            <p className="text-muted-foreground">
                No flows have been recorded yet.
                <br />
                To start capturing traffic, please configure your settings in
                the Capture tab.
            </p>
        </div>
    );
}

function ServerDescription({
    description,
    listen_addrs,
    is_running,
    wireguard_conf,
    type,
}: ServerInfo) {
    const qrCode = useRef(null);
    useEffect(() => {
        if (wireguard_conf && qrCode.current)
            QRCode.toCanvas(qrCode.current, wireguard_conf, {
                margin: 0,
                scale: 3,
            });
    }, [wireguard_conf]);

    let listen_str;
    const all_same_port =
        listen_addrs.length === 1 ||
        (listen_addrs.length === 2 &&
            listen_addrs[0][1] === listen_addrs[1][1]);
    const unbound = listen_addrs.every((addr) =>
        ["::", "0.0.0.0"].includes(addr[0]),
    );
    if (all_same_port && unbound) {
        listen_str = formatAddress(["*", listen_addrs[0][1]]);
    } else {
        listen_str = listen_addrs.map(formatAddress).join(" and ");
    }
    description = description[0].toUpperCase() + description.substr(1);
    let desc;
    if (!is_running) {
        desc = (
            <>
                <div className="text-warning">{description} starting...</div>
            </>
        );
    } else {
        desc = (
            <>
                {type === "local" ? (
                    <div className="text-success">{description} is active.</div>
                ) : (
                    <div className="text-success">
                        {description} listening at {listen_str}.
                    </div>
                )}
                {wireguard_conf && (
                    <div className="mt-2 space-y-2">
                        <pre className="p-2 bg-muted rounded text-xs overflow-auto">
                            {wireguard_conf}
                        </pre>
                        <canvas ref={qrCode} className="rounded" />
                    </div>
                )}
            </>
        );
    }
    return <div>{desc}</div>;
}

export function ServerStatus({
    error,
    backendState,
}: {
    error?: string;
    backendState?: ServerInfo;
}) {
    return (
        <div className="mt-1 text-xs">
            {error ? (
                <div className="text-destructive">{error}</div>
            ) : (
                backendState && <ServerDescription {...backendState} />
            )}
        </div>
    );
}
