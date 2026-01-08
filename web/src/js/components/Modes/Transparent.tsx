import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../ducks";
import type { TransparentState } from "../../modes/transparent";
import { getSpec } from "../../modes/transparent";
import type { ServerInfo } from "../../ducks/backendState";
import {
    setActive,
    setListenHost,
    setListenPort,
} from "../../ducks/modes/transparent";

import { ModeToggle } from "./ModeToggle";
import { ServerStatus } from "./CaptureSetup";
import ValueEditor from "../editors/ValueEditor";
import { Popover } from "./Popover";
import { Label } from "@/components/ui/label";

export default function Transparent() {
    const serverState = useAppSelector((state) => state.modes.transparent);
    const backendState = useAppSelector((state) => state.backendState.servers);

    const servers = serverState.map((server) => {
        return (
            <TransparentRow
                key={server.ui_id}
                server={server}
                backendState={backendState[getSpec(server)]}
            />
        );
    });

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold">Transparent Proxy</h4>
            <p className="text-xs text-muted-foreground">
                You{" "}
                <a
                    href="https://docs.mitmproxy.org/stable/howto-transparent/"
                    className="underline hover:text-foreground"
                >
                    configure your routing table
                </a>{" "}
                to send traffic through mitmproxy.
            </p>

            {servers}
        </div>
    );
}

function TransparentRow({
    server,
    backendState,
}: {
    server: TransparentState;
    backendState?: ServerInfo;
}) {
    const dispatch = useAppDispatch();

    const error = server.error || backendState?.last_exception || undefined;

    return (
        <div>
            <ModeToggle
                value={server.active}
                label="Run Transparent Proxy"
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
