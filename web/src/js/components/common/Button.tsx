import * as React from "react";
import { Button as ShadcnButton } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

export interface ButtonProps {
    onClick: () => void;
    children?: React.ReactNode;
    icon?: LucideIcon;
    disabled?: boolean;
    className?: string;
    title?: string;
}

export default function Button({
    onClick,
    children,
    icon: Icon,
    disabled,
    className,
    title,
}: ButtonProps) {
    return (
        <ShadcnButton
            variant="outline"
            size="sm"
            className={cn(className)}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            title={title}
        >
            {Icon && <Icon className="h-4 w-4 mr-1" />}
            {children}
        </ShadcnButton>
    );
}
