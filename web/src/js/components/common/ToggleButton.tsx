import React from "react";
import { Button } from "@/components/ui/button";
import { CheckSquare, Square } from "lucide-react";

type ToggleButtonProps = {
    checked: boolean;
    onToggle: () => any;
    text: string;
};

export default function ToggleButton({
    checked,
    onToggle,
    text,
}: ToggleButtonProps) {
    return (
        <Button
            variant={checked ? "secondary" : "ghost"}
            size="sm"
            onClick={onToggle}
            className="h-6 px-2 text-xs gap-1"
        >
            {checked ? (
                <CheckSquare className="h-3 w-3" />
            ) : (
                <Square className="h-3 w-3" />
            )}
            {text}
        </Button>
    );
}
