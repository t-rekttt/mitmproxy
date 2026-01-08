import * as React from "react";
import { ConnectionState } from "../../ducks/connection";
import { useAppSelector } from "../../ducks";
import { assertNever } from "../../utils";
import { Badge } from "@/components/ui/badge";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Wifi, WifiOff, Loader2, Download } from "lucide-react";

export default React.memo(function ConnectionIndicator(): React.ReactElement {
    const connState = useAppSelector((state) => state.connection.state);
    const message = useAppSelector((state) => state.connection.message);

    switch (connState) {
        case ConnectionState.INIT:
            return (
                <Badge
                    variant="secondary"
                    className="gap-1.5 text-muted-foreground"
                >
                    <Loader2 className="h-3 w-3 animate-spin" />
                    connecting…
                </Badge>
            );
        case ConnectionState.FETCHING:
            return (
                <Badge variant="secondary" className="gap-1.5 text-info">
                    <Download className="h-3 w-3 animate-pulse" />
                    fetching data…
                </Badge>
            );
        case ConnectionState.ESTABLISHED:
            return (
                <Badge variant="success" className="gap-1.5">
                    <Wifi className="h-3 w-3" />
                    connected
                </Badge>
            );
        case ConnectionState.ERROR:
            return (
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Badge variant="destructive" className="gap-1.5">
                            <WifiOff className="h-3 w-3" />
                            connection lost
                        </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>{message}</p>
                    </TooltipContent>
                </Tooltip>
            );
        /* istanbul ignore next @preserve */
        default:
            assertNever(connState);
    }
});
