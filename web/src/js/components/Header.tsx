import { useEffect, useState, type JSX } from "react";
import FileMenu from "./Header/FileMenu";
import ConnectionIndicator from "./Header/ConnectionIndicator";
import ThemeToggle from "./Header/ThemeToggle";
import HideInStatic from "./common/HideInStatic";
import CaptureMenu from "./Header/CaptureMenu";
import { useAppDispatch, useAppSelector } from "../ducks";
import FlowListMenu from "./Header/FlowListMenu";
import OptionMenu from "./Header/OptionMenu";
import FlowMenu from "./Header/FlowMenu";
import { Tab, setCurrent } from "../ducks/ui/tabs";
import { cn } from "@/lib/utils";

export interface Menu {
    (): JSX.Element;
    title: string;
}

const tabs: { [key in Tab]: Menu } = {
    [Tab.Capture]: CaptureMenu,
    [Tab.FlowList]: FlowListMenu,
    [Tab.Options]: OptionMenu,
    [Tab.Flow]: FlowMenu,
};

export default function Header() {
    const dispatch = useAppDispatch();
    const currentTab = useAppSelector((state) => state.ui.tabs.current);
    const selectedFlows = useAppSelector((state) => state.flows.selected);
    const [wasFlowSelected, setWasFlowSelected] = useState(false);

    const entries: Tab[] = [Tab.Capture, Tab.FlowList, Tab.Options];
    if (selectedFlows.length > 0) {
        entries.push(Tab.Flow);
    }

    // Switch to "Flow" tab if we just selected a new flow.
    useEffect(() => {
        if (selectedFlows.length > 0 && !wasFlowSelected) {
            // User just clicked on a flow without having previously selected one.
            dispatch(setCurrent(Tab.Flow));
            setWasFlowSelected(true);
        } else if (selectedFlows.length === 0) {
            if (wasFlowSelected) {
                setWasFlowSelected(false);
            }
            if (currentTab === Tab.Flow) {
                dispatch(setCurrent(Tab.FlowList));
            }
        }
    }, [selectedFlows, wasFlowSelected, currentTab]);

    function handleClick(tab: Tab, e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        dispatch(setCurrent(tab));
    }

    const ActiveMenu = tabs[currentTab];

    return (
        <header className="flex-shrink-0 border-b border-border bg-card">
            <nav className="flex items-center h-10 px-2 gap-1">
                <FileMenu />
                <div className="flex items-center gap-1 border-l border-border pl-2 ml-1">
                    {entries.map((tab) => (
                        <button
                            key={tab}
                            className={cn(
                                "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                "hover:bg-accent hover:text-accent-foreground",
                                tab === currentTab
                                    ? "bg-accent text-accent-foreground"
                                    : "text-muted-foreground",
                            )}
                            onClick={(e) => handleClick(tab, e)}
                        >
                            {tabs[tab].title}
                        </button>
                    ))}
                </div>
                <div className="flex-1" />
                <ThemeToggle />
                <HideInStatic>
                    <ConnectionIndicator />
                </HideInStatic>
            </nav>
            <div className="px-2 py-1.5 border-t border-border">
                <ActiveMenu />
            </div>
        </header>
    );
}
