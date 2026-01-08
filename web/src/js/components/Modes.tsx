import * as React from "react";
import Local from "./Modes/Local";
import Regular from "./Modes/Regular";
import Wireguard from "./Modes/Wireguard";
import Reverse from "./Modes/Reverse";
import { useAppSelector } from "../ducks";
import Transparent from "./Modes/Transparent";
import Socks from "./Modes/Socks";
import Upstream from "./Modes/Upstream";
import Dns from "./Modes/Dns";
import MissingMode from "./Modes/MissingMode";

export default function Modes() {
    const { platform, localModeUnavailable } = useAppSelector(
        (state) => state.backendState,
    );

    return (
        <div className="p-6 space-y-6">
            <div>
                <h2 className="text-xl font-semibold">Intercept Traffic</h2>
                <p className="text-muted-foreground">
                    Configure how you want to intercept traffic with mitmproxy.
                </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4 space-y-4">
                <h3 className="text-lg font-medium">Recommended</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <Regular />
                    {localModeUnavailable !== null ? (
                        <MissingMode
                            title="Local Redirect Mode"
                            description={localModeUnavailable}
                        />
                    ) : (
                        <Local />
                    )}
                    <Wireguard />
                    <Reverse />
                </div>
            </div>
            <div className="border-l-4 border-muted-foreground pl-4 space-y-4">
                <h3 className="text-lg font-medium">Advanced</h3>
                <div className="grid gap-4 md:grid-cols-2">
                    <Socks />
                    <Upstream />
                    <Dns />
                    {!platform.startsWith("win32") ? (
                        <Transparent />
                    ) : (
                        <MissingMode
                            title="Transparent Proxy"
                            description="This mode is only supported on Linux and MacOS."
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
