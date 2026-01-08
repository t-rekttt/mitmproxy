import * as React from "react";
import { useAppDispatch, useAppSelector } from "../../ducks";
import {
    addServer,
    removeServer,
    setActive,
    setDestination,
    setListenHost,
    setListenPort,
    setProtocol,
} from "../../ducks/modes/reverse";
import type { ReverseState } from "../../modes/reverse";
import { getSpec } from "../../modes/reverse";
import { ReverseProxyProtocols } from "../../backends/consts";
import type { ServerInfo } from "../../ducks/backendState";
import ValueEditor from "../editors/ValueEditor";
import { ServerStatus } from "./CaptureSetup";
import { ModeToggle } from "./ModeToggle";
import { Popover } from "./Popover";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { PlusSquare, Trash2 } from "lucide-react";

interface ReverseToggleRowProps {
    removable: boolean;
    server: ReverseState;
    backendState?: ServerInfo;
}

export default function Reverse() {
    const dispatch = useAppDispatch();

    const servers = useAppSelector((state) => state.modes.reverse);
    const backendState = useAppSelector((state) => state.backendState.servers);

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold">Reverse Proxy</h4>
            <p className="text-xs text-muted-foreground">
                Requests are forwarded to a preconfigured destination.
            </p>
            <div className="space-y-2">
                {servers.map((server, i) => (
                    <ReverseToggleRow
                        key={server.ui_id}
                        removable={i > 0}
                        server={server}
                        backendState={backendState[getSpec(server)]}
                    />
                ))}
                <Button
                    variant="ghost"
                    size="sm"
                    className="gap-2 text-xs"
                    onClick={() => dispatch(addServer())}
                >
                    <PlusSquare className="h-4 w-4" />
                    Add additional server
                </Button>
            </div>
        </div>
    );
}

function ReverseToggleRow({
    removable,
    server,
    backendState,
}: ReverseToggleRowProps) {
    const dispatch = useAppDispatch();

    const protocols = Object.values(ReverseProxyProtocols);

    const deleteServer = async () => {
        if (server.active) {
            await dispatch(setActive({ server, value: false })).unwrap();
        }
        await dispatch(removeServer(server));
    };

    const error = server.error || backendState?.last_exception || undefined;

    return (
        <div>
            <ModeToggle
                value={server.active}
                label="Forward"
                onChange={() => {
                    dispatch(setActive({ server, value: !server.active }));
                }}
            >
                <Select
                    value={server.protocol}
                    onValueChange={(value) => {
                        dispatch(
                            setProtocol({
                                server,
                                value: value as ReverseProxyProtocols,
                            }),
                        );
                    }}
                >
                    <SelectTrigger className="h-7 w-auto min-w-[80px] text-xs">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                        {protocols.map((prot) => (
                            <SelectItem key={prot} value={prot}>
                                {prot}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <span className="text-sm">traffic to</span>
                <ValueEditor
                    className="px-2 py-1 text-sm bg-background border border-input rounded min-w-[120px]"
                    content={server.destination?.toString() || ""}
                    onEditDone={(value) =>
                        dispatch(setDestination({ server, value }))
                    }
                    placeholder="example.com"
                />
                <Popover>
                    <h4 className="font-semibold mb-3">Advanced Configuration</h4>
                    <div className="space-y-3">
                        <div>
                            <Label className="text-xs">Listen Host</Label>
                            <ValueEditor
                                className="mt-1 w-full px-2 py-1 text-sm bg-background border border-input rounded"
                                content={server.listen_host || ""}
                                onEditDone={(value) =>
                                    dispatch(setListenHost({ server, value }))
                                }
                                placeholder="*"
                            />
                        </div>
                        <div>
                            <Label className="text-xs">Listen Port</Label>
                            <ValueEditor
                                className="mt-1 w-full px-2 py-1 text-sm bg-background border border-input rounded"
                                content={String(server.listen_port || "")}
                                onEditDone={(value) =>
                                    dispatch(
                                        setListenPort({
                                            server,
                                            value: value as unknown as number,
                                        }),
                                    )
                                }
                                placeholder="8080"
                            />
                        </div>
                    </div>
                </Popover>
                {removable && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-destructive hover:text-destructive"
                        onClick={deleteServer}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                )}
            </ModeToggle>
            <ServerStatus error={error} backendState={backendState} />
        </div>
    );
}
