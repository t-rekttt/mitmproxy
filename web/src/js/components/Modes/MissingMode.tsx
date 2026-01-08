import * as React from "react";
import { AlertTriangle } from "lucide-react";

interface MissingModeProps {
    title: string;
    description: string;
}

export default function MissingMode({ title, description }: MissingModeProps) {
    return (
        <div className="space-y-2 opacity-60">
            <div className="flex items-center gap-2">
                <h4 className="text-sm font-semibold">{title}</h4>
                <AlertTriangle className="h-4 w-4 text-warning" />
            </div>
            <p className="text-xs text-muted-foreground">{description}</p>
        </div>
    );
}
