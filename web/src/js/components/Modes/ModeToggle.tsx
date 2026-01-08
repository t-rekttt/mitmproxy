import * as React from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type ModeToggleProps = {
    value: boolean;
    label: string;
    onChange: (e: React.ChangeEvent) => void;
    children: React.ReactNode;
};

export function ModeToggle({
    value,
    onChange,
    children,
    label,
}: ModeToggleProps) {
    const id = React.useId();

    return (
        <div className="flex items-center gap-3 py-2">
            <Switch
                id={`mode-switch-${id}`}
                checked={value}
                onCheckedChange={() => onChange({} as React.ChangeEvent)}
            />
            <Label
                htmlFor={`mode-switch-${id}`}
                className="text-sm font-normal cursor-pointer"
            >
                {label}
            </Label>
            {children}
        </div>
    );
}
