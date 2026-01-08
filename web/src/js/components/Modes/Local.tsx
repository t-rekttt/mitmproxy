import * as React from "react";
import { ModeToggle } from "./ModeToggle";
import { useAppDispatch, useAppSelector } from "../../ducks";
import { setActive, setSelectedProcesses } from "../../ducks/modes/local";
import type { LocalState } from "../../modes/local";
import { getSpec } from "../../modes/local";
import { ServerStatus } from "./CaptureSetup";
import type { ServerInfo } from "../../ducks/backendState";
import LocalDropdown from "./LocalDropdown";
import { fetchProcesses } from "../../ducks/processes";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { X, RefreshCw } from "lucide-react";

export default function Local() {
    const serverState = useAppSelector((state) => state.modes.local);
    const backendState = useAppSelector((state) => state.backendState.servers);

    const servers = serverState.map((server) => {
        return (
            <LocalRow
                key={server.ui_id}
                server={server}
                backendState={backendState[getSpec(server)]}
            />
        );
    });

    return (
        <div className="space-y-2">
            <h4 className="text-sm font-semibold">Local Applications</h4>
            <p className="text-xs text-muted-foreground">
                Transparently Intercept local application(s).
            </p>
            {servers}
        </div>
    );
}

function LocalRow({
    server,
    backendState,
}: {
    server: LocalState;
    backendState?: ServerInfo;
}) {
    const dispatch = useAppDispatch();

    const fetchProcessesError = useAppSelector(
        (state) => state.processes.error,
    );

    const error =
        server.error ||
        backendState?.last_exception ||
        fetchProcessesError ||
        undefined;

    const handleDeletionProcess = (process: string) => {
        const newSelectedProcesses = server.selectedProcesses
            ?.split(/,\s*/)
            .filter((p) => p !== process)
            .join(", ");

        dispatch(
            setSelectedProcesses({
                server,
                value: newSelectedProcesses,
            }),
        );
    };

    return (
        <div>
            <ModeToggle
                value={server.active}
                label="Intercept traffic for"
                onChange={() =>
                    dispatch(setActive({ server, value: !server.active }))
                }
            >
                <div className="flex-1 flex flex-col gap-2">
                    <div className="flex flex-wrap gap-1">
                        {server.selectedProcesses
                            ?.split(/,\s*/)
                            .filter((p) => p.trim() !== "")
                            .map((p) => (
                                <Badge
                                    key={p}
                                    variant="secondary"
                                    className="gap-1 pr-1"
                                >
                                    {p}
                                    <button
                                        className="ml-1 hover:text-destructive"
                                        onClick={() => handleDeletionProcess(p)}
                                    >
                                        <X className="h-3 w-3" />
                                    </button>
                                </Badge>
                            ))}
                    </div>
                    <div className="flex items-center gap-2">
                        <LocalDropdown server={server} />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => dispatch(fetchProcesses())}
                        >
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </ModeToggle>
            <ServerStatus error={error} backendState={backendState} />
        </div>
    );
}
