import React from "react";
import { useAppSelector } from "../../ducks";
import Dropdown, { MenuItem } from "../common/Dropdown";
import { Files, ChevronDown } from "lucide-react";

type ViewSelectorProps = {
    value: string;
    onChange: (string) => void;
};

export default function ViewSelector({ value, onChange }: ViewSelectorProps) {
    const contentViews = useAppSelector(
        (state) => state.backendState.contentViews || [],
    );

    const inner = (
        <span className="inline-flex items-center gap-1">
            <Files className="h-3 w-3" />
            <b>View:</b> {value.toLowerCase()} <ChevronDown className="h-3 w-3" />
        </span>
    );

    return (
        <Dropdown text={inner} options={{ placement: "top-end" }}>
            {contentViews.map((name) => (
                <MenuItem key={name} onClick={() => onChange(name)}>
                    {name.toLowerCase().replace("_", " ")}
                </MenuItem>
            ))}
        </Dropdown>
    );
}
