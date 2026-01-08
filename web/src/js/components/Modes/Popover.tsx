import * as React from "react";
import {
    Popover as ShadcnPopover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface PopoverProps {
    children: React.ReactNode;
    classname?: string;
    isVisible?: boolean;
}

export function Popover({
    children,
    classname,
    isVisible,
}: PopoverProps) {
    const [open, setOpen] = React.useState(false);

    React.useEffect(() => {
        if (isVisible === true) {
            setOpen(true);
        }
    }, [isVisible]);

    return (
        <ShadcnPopover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7", classname)}
                >
                    <Settings className="h-4 w-4" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4" align="start">
                {children}
            </PopoverContent>
        </ShadcnPopover>
    );
}
