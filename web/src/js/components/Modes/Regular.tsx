import * as React from "react";
import { ModeToggle } from "./ModeToggle";
import { useAppDispatch, useAppSelector } from "../../ducks";
import {
    setListenPort,
    setActive,
    setListenHost,
} from "../../ducks/modes/regular";
import ValueEditor from "../editors/ValueEditor";
import type { RegularState } from "../../modes/regular";
import { getSpec } from "../../modes/regular";
import { Popover } from "./Popover";
import type { ServerInfo } from "../../ducks/backendState";
import { ServerStatus } from "./CaptureSetup";
import { Label } from "@/components/ui/label";

export default function Regular() {
    const serverState = useAppSelector((state) => state.modes.regular);
    const backendState = useAppSelector((state) => state.backendState.servers);

    const servers = serverState.map((server) => {
        return (
            <RegularRow
                key={server.ui_id}
                server={server}
                backendState={backendState[getSpec(server)]}
            />
        );
    });

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold">Explicit HTTP(S) Proxy</h4>
            <p className="text-xs text-muted-foreground">
                You manually configure your client application or device to use
                an HTTP(S) proxy.
            </p>
            {servers}
        </div>
    );
}

function RegularRow({
    server,
    backendState,
}: {
    server: RegularState;
    error?: string;
    backendState?: ServerInfo;
}) {
    const dispatch = useAppDispatch();

    const error = server.error || backendState?.last_exception || undefined;

    return (
        <div>
            <ModeToggle
                value={server.active}
                label="Run HTTP/S Proxy"
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
