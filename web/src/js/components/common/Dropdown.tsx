import React, { useState } from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

export const Divider = () => <DropdownMenuSeparator />;

type MenuItemProps = {
    onClick: () => void;
    children: React.ReactNode;
};

export function MenuItem({ onClick, children }: MenuItemProps) {
    return <DropdownMenuItem onClick={onClick}>{children}</DropdownMenuItem>;
}

type SubMenuProps = {
    title: string;
    children: React.ReactNode;
    className?: string;
};

export function SubMenu({ title, children }: SubMenuProps) {
    return (
        <DropdownMenuSub>
            <DropdownMenuSubTrigger>{title}</DropdownMenuSubTrigger>
            <DropdownMenuSubContent>{children}</DropdownMenuSubContent>
        </DropdownMenuSub>
    );
}

type DropdownProps = {
    text: React.ReactNode;
    children: React.ReactNode;
    options?: { placement?: string };
    className?: string;
    onOpen?: (b: boolean) => void;
};

export default React.memo(function Dropdown({
    text,
    children,
    onOpen,
}: DropdownProps) {
    const [open, setOpen] = useState(false);

    const handleOpenChange = (isOpen: boolean) => {
        setOpen(isOpen);
        if (onOpen) onOpen(isOpen);
    };

    return (
        <DropdownMenu open={open} onOpenChange={handleOpenChange}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 h-8">
                    {text}
                    <ChevronDown className="h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">{children}</DropdownMenuContent>
        </DropdownMenu>
    );
});
