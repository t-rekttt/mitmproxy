import * as React from "react";
import Splitter from "./common/Splitter";
import FlowTable from "./FlowTable";
import FlowView from "./FlowView";
import { useAppSelector } from "../ducks";
import CaptureSetup from "./Modes/CaptureSetup";
import Modes from "./Modes";
import { Tab } from "../ducks/ui/tabs";
import { cn } from "@/lib/utils";

export default function MainView() {
    const hasOneFlowSelected = useAppSelector(
        (state) => state.flows.selected.length === 1,
    );
    const hasFlows = useAppSelector((state) => state.flows.list.length > 0);
    const currentTab = useAppSelector((state) => state.ui.tabs.current);

    return (
        <div className={cn("flex-1 flex flex-col min-h-0 overflow-hidden")}>
            {currentTab === Tab.Capture ? (
                <div className="flex-1 overflow-auto">
                    <Modes />
                </div>
            ) : (
                <>
                    {hasFlows ? <FlowTable /> : <CaptureSetup />}
                    {hasOneFlowSelected && (
                        <>
                            <Splitter key="splitter" axis="y" />
                            <FlowView key="flowDetails" />
                        </>
                    )}
                </>
            )}
        </div>
    );
}
