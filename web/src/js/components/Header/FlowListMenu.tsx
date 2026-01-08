import * as React from "react";
import FilterInput, { FilterIcon } from "./FilterInput";
import * as flowsActions from "../../ducks/flows";
import Button from "../common/Button";
import { update as updateOptions } from "../../ducks/options";
import { useAppDispatch, useAppSelector } from "../../ducks";
import { FilterName, setFilter, setHighlight } from "../../ducks/ui/filter";
import { FastForward } from "lucide-react";

FlowListMenu.title = "Flow List";

export default function FlowListMenu() {
    return (
        <div className="flex gap-6 p-2">
            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <FlowFilterInput />
                    <HighlightInput />
                </div>
                <div className="text-xs text-muted-foreground">Find</div>
            </div>

            <div className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                    <InterceptInput />
                    <ResumeAll />
                </div>
                <div className="text-xs text-muted-foreground">Intercept</div>
            </div>
        </div>
    );
}

function InterceptInput() {
    const dispatch = useAppDispatch();
    const value = useAppSelector((state) => state.options.intercept);
    return (
        <FilterInput
            value={value || ""}
            placeholder="Intercept"
            icon={FilterIcon.INTERCEPT}
            color="hsl(208, 56%, 53%)"
            onChange={(val) => dispatch(updateOptions("intercept", val))}
        />
    );
}

function FlowFilterInput() {
    const dispatch = useAppDispatch();
    const value = useAppSelector((state) => state.ui.filter[FilterName.Search]);
    return (
        <FilterInput
            value={value}
            placeholder="Search"
            icon={FilterIcon.SEARCH}
            color="currentColor"
            onChange={(expr) => dispatch(setFilter(expr))}
        />
    );
}

function HighlightInput() {
    const dispatch = useAppDispatch();
    const value = useAppSelector(
        (state) => state.ui.filter[FilterName.Highlight],
    );
    return (
        <FilterInput
            value={value}
            placeholder="Highlight"
            icon={FilterIcon.HIGHLIGHT}
            color="hsl(48, 100%, 50%)"
            onChange={(expr) => dispatch(setHighlight(expr))}
        />
    );
}

export function ResumeAll() {
    const dispatch = useAppDispatch();
    return (
        <Button
            title="[a]ccept all"
            icon={FastForward}
            onClick={() => dispatch(flowsActions.resumeAll())}
        >
            Resume All
        </Button>
    );
}
