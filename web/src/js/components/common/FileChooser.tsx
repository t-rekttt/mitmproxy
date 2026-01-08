import React, { useId, useRef } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type FileChooserProps = {
    icon?: React.ReactNode;
    text?: string;
    className?: string;
    title?: string;
    onOpenFile: (file: File) => void;
    onClick?: (e: React.MouseEvent) => void;
    variant?: "menu" | "button";
};

export default React.memo(function FileChooser({
    icon,
    text,
    title,
    onOpenFile,
    onClick,
    className,
    variant = "button",
}: FileChooserProps) {
    const id = useId();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (e.target.files && e.target.files.length > 0) {
            onOpenFile(e.target.files[0]);
        }
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    if (variant === "menu") {
        return (
            <>
                <label
                    htmlFor={id}
                    title={title}
                    className={cn(
                        "relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
                        className
                    )}
                    onClick={onClick}
                >
                    {icon}
                    {text}
                </label>
                <input
                    id={id}
                    ref={fileInputRef}
                    className="hidden"
                    type="file"
                    onChange={handleFileChange}
                />
            </>
        );
    }

    return (
        <>
            <Button
                variant="outline"
                size="sm"
                className={cn(className)}
                title={title}
                onClick={() => fileInputRef.current?.click()}
            >
                {icon}
                {text}
            </Button>
            <input
                ref={fileInputRef}
                className="hidden"
                type="file"
                onChange={handleFileChange}
            />
        </>
    );
});
