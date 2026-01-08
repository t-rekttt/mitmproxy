import * as React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

type ModalLayoutProps = {
    children: React.ReactNode;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
};

export default function ModalLayout({
    children,
    open = true,
    onOpenChange,
}: ModalLayoutProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl h-[85vh] overflow-hidden flex flex-col">
                {children}
            </DialogContent>
        </Dialog>
    );
}
