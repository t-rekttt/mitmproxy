import * as React from "react";
import { ModeToggle } from "./ModeToggle";
import { useAppDispatch, useAppSelector } from "../../ducks";
import type { WireguardState } from "../../modes/wireguard";
import { getSpec } from "../../modes/wireguard";
import {
    setActive,
    setFilePath,
    setListenHost,
    setListenPort,
} from "../../ducks/modes/wireguard";
import { Popover } from "./Popover";
import ValueEditor from "../editors/ValueEditor";
import type { ServerInfo } from "../../ducks/backendState";
import { ServerStatus } from "./CaptureSetup";
import { Label } from "@/components/ui/label";

export default function Wireguard() {
    const serverState = useAppSelector((state) => state.modes.wireguard);
    const backendState = useAppSelector((state) => state.backendState.servers);

    const servers = serverState.map((server) => {
        return (
            <WireGuardRow
                key={server.ui_id}
                server={server}
                backendState={backendState[getSpec(server)]}
            />
        );
    });

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold">WireGuard Server</h4>
            <p className="text-xs text-muted-foreground">
                Start a WireGuard™ server and connect an external device for
                transparent proxying.
            </p>
            {servers}
        </div>
    );
}

function WireGuardRow({
    server,
    backendState,
}: {
    server: WireguardState;
    backendState?: ServerInfo;
}) {
    const dispatch = useAppDispatch();

    const error = server.error || backendState?.last_exception || undefined;

    return (
        <div>
            <ModeToggle
                value={server.active}
                label="Run WireGuard Server"
                onChange={() =>
                    dispatch(setActive({ server, value: !server.active }))
                }
            >
                <Popover>
                    <h4 className="font-semibold mb-3">Advanced Configuration</h4>
                    <div className="space-y-3">
                        <div>
                            <Label className="text-xs">Listen Host</Label>
                            <ValueEditor
                                className="mt-1 w-full px-2 py-1 text-sm bg-background border border-input rounded"
                                content={server.listen_host || ""}
                                placeholder="(all interfaces)"
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
                                placeholder="51820"
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
                        <div>
                            <Label className="text-xs">Configuration File</Label>
                            <ValueEditor
                                className="mt-1 w-full px-2 py-1 text-sm bg-background border border-input rounded"
                                content={server.file_path || ""}
                                placeholder="~/.mitmproxy/wireguard.conf"
                                onEditDone={(path) =>
                                    dispatch(setFilePath({ server, value: path }))
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
