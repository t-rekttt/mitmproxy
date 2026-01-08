/* eslint-disable react/prop-types */
import React from "react";
import { connect, shallowEqual } from "react-redux";
import type { Option } from "../../ducks/options";
import { compact, isEmpty } from "lodash";
import type { RootState } from "../../ducks";
import { useAppSelector } from "../../ducks";
import OptionInput from "./OptionInput";
import {
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

function OptionHelp({ name }: { name: Option }) {
    const help = useAppSelector((state) => state.options_meta[name]?.help);
    return <div className="text-xs text-muted-foreground mt-1">{help}</div>;
}

function OptionError({ name }) {
    const error = useAppSelector((state) => state.options_meta[name]?.error);
    if (!error) return null;
    return <div className="text-xs text-destructive mt-1">{error}</div>;
}

export function PureOptionDefault({ value, defaultVal }) {
    if (value === defaultVal) {
        return null;
    } else {
        if (typeof defaultVal === "boolean") {
            defaultVal = defaultVal ? "true" : "false";
        } else if (Array.isArray(defaultVal)) {
            if (
                isEmpty(compact(value)) && // filter the empty string in array
                isEmpty(defaultVal)
            ) {
                return null;
            }
            defaultVal = "[ ]";
        } else if (defaultVal === "") {
            defaultVal = '""';
        } else if (defaultVal === null) {
            defaultVal = "null";
        }
        return (
            <div className="text-xs text-muted-foreground mt-1">
                Default: <strong>{defaultVal}</strong>
            </div>
        );
    }
}

const OptionDefault = connect(
    (state: RootState, { name }: { name: Option }) => ({
        value: state.options[name],
        defaultVal: state.options_meta[name]?.default,
    }),
)(PureOptionDefault);

export default function OptionModal() {
    const options = useAppSelector(
        (state) => Object.keys(state.options_meta),
        shallowEqual,
    ).sort() as Option[];

    return (
        <>
            <DialogHeader className="flex-shrink-0">
                <DialogTitle>Options</DialogTitle>
                <DialogDescription>
                    Configure mitmproxy settings
                </DialogDescription>
            </DialogHeader>

            <ScrollArea className="flex-1 min-h-0">
                <div className="space-y-4 py-4 pr-4">
                    {options.map((name) => (
                        <div
                            key={name}
                            className={cn(
                                "grid grid-cols-2 gap-4 py-3",
                                "border-b border-border/50 last:border-0",
                            )}
                        >
                            <div>
                                <label
                                    htmlFor={name}
                                    className="text-sm font-medium"
                                >
                                    {name}
                                </label>
                                <OptionHelp name={name} />
                            </div>
                            <div>
                                <OptionInput name={name} />
                                <OptionError name={name} />
                                <OptionDefault name={name} />
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </>
    );
}
