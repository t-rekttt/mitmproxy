import "@/styles/globals.css";
import * as React from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import ProxyApp from "./components/ProxyApp";
import { add as addLog } from "./ducks/eventLog";
import useUrlState from "./urlState";
import WebSocketBackend from "./backends/websocket";
import StaticBackend from "./backends/static";
import { store } from "./ducks";
import { TooltipProvider } from "@/components/ui/tooltip";

// Extend the Window interface to avoid TS errors
declare global {
    interface Window {
        MITMWEB_STATIC?: boolean;
    }
}

if (window.MITMWEB_STATIC) {
    // @ts-expect-error this is not declared above as it should not be used.
    window.backend = new StaticBackend(store);
} else {
    // @ts-expect-error this is not declared above as it should not be used.
    window.backend = new WebSocketBackend(store);
}

useUrlState(store);

// Initialize theme on startup
const currentTheme = store.getState().ui.theme.current;
if (currentTheme === "dark") {
    document.documentElement.classList.add("dark");
} else {
    document.documentElement.classList.remove("dark");
}

window.addEventListener("error", (e: ErrorEvent) => {
    store.dispatch(addLog(`${e.message}\n${e.error.stack}`));
});

document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("mitmproxy");
    const root = createRoot(container!);
    root.render(
        <Provider store={store}>
            <TooltipProvider>
                <ProxyApp />
            </TooltipProvider>
        </Provider>,
    );
});

// Export React for window access
window.React = React;
