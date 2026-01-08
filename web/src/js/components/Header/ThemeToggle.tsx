import { useAppDispatch, useAppSelector } from "../../ducks";
import { toggleTheme } from "../../ducks/ui/theme";
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";

export default function ThemeToggle() {
    const dispatch = useAppDispatch();
    const currentTheme = useAppSelector((state) => state.ui.theme.current);

    const handleToggle = () => {
        dispatch(toggleTheme());
        // Update document class for Tailwind dark mode
        if (currentTheme === "light") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <Tooltip>
            <TooltipTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleToggle}
                    className="h-8 w-8"
                >
                    {currentTheme === "light" ? (
                        <Moon className="h-4 w-4" />
                    ) : (
                        <Sun className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                        Switch to {currentTheme === "light" ? "dark" : "light"}{" "}
                        theme
                    </span>
                </Button>
            </TooltipTrigger>
            <TooltipContent>
                <p>
                    Switch to {currentTheme === "light" ? "dark" : "light"} theme
                </p>
            </TooltipContent>
        </Tooltip>
    );
}
