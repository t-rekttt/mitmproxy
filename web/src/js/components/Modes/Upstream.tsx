import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../ducks";
import type { UpstreamState } from "../../modes/upstream";
import { getSpec } from "../../modes/upstream";
import type { ServerInfo } from "../../ducks/backendState";
import {
    setDestination,
    setActive,
    setListenHost,
    setListenPort,
} from "../../ducks/modes/upstream";
import ValueEditor from "../editors/ValueEditor";
import { ServerStatus } from "./CaptureSetup";
import { ModeToggle } from "./ModeToggle";
import { Popover } from "./Popover";
import { Label } from "@/components/ui/label";

export default function Upstream() {
    const serverState = useAppSelector((state) => state.modes.upstream);
    const backendState = useAppSelector((state) => state.backendState.servers);

    const servers = serverState.map((server) => {
        return (
            <UpstreamRow
                key={server.ui_id}
                server={server}
                backendState={backendState[getSpec(server)]}
            />
        );
    });

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold">
                Explicit HTTP(S) Proxy (With Upstream Proxy)
            </h4>
            <p className="text-xs text-muted-foreground">
                All requests are forwarded to a second HTTP(S) proxy server.
            </p>
            {servers}
        </div>
    );
}

function UpstreamRow({
    server,
    backendState,
}: {
    server: UpstreamState;
    backendState?: ServerInfo;
}) {
    const dispatch = useAppDispatch();

    const error = server.error || backendState?.last_exception || undefined;

    return (
        <div>
            <ModeToggle
                value={server.active}
                label="Run HTTP/S Proxy and forward requests to"
                onChange={() => {
                    dispatch(setActive({ server, value: !server.active }));
                }}
            >
                <ValueEditor
                    className="px-2 py-1 text-sm bg-background border border-input rounded min-w-[180px]"
                    content={server.destination?.toString() || ""}
                    onEditDone={(value) =>
                        dispatch(setDestination({ server, value }))
                    }
                    placeholder="http://example.com:8080"
                />
                <Popover>
                    <h4 className="font-semibold mb-3">Advanced Configuration</h4>
                    <div className="space-y-3">
                        <div>
                            <Label className="text-xs">Listen Host</Label>
                            <ValueEditor
                                className="mt-1 w-full px-2 py-1 text-sm bg-background border border-input rounded"
                                content={server.listen_host || ""}
                                onEditDone={(host) =>
                                    dispatch(setListenHost({ server, value: host }))
                                }
                            />
                        </div>
                        <div>
                            <Label className="text-xs">Listen Port</Label>
                            <ValueEditor
                                className="mt-1 w-full px-2 py-1 text-sm bg-background border border-input rounded"
                                content={
                                    server.listen_port
                                        ? server.listen_port.toString()
                                        : ""
                                }
                                placeholder="8080"
                                onEditDone={(port) =>
                                    dispatch(
                                        setListenPort({
                                            server,
                                            value: parseInt(port),
                                        }),
                                    )
                                }
                            />
                        </div>
                    </div>
                </Popover>
            </ModeToggle>
            <ServerStatus error={error} backendState={backendState} />
        </div>
    );
}
