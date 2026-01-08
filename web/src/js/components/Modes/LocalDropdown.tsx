import * as React from "react";
import type { LocalState } from "../../modes/local";
import { useAppDispatch, useAppSelector } from "../../ducks";
import { setSelectedProcesses } from "../../ducks/modes/local";
import type { Process } from "../../ducks/processes";
import { fetchProcesses } from "../../ducks/processes";
import { rpartition } from "../../utils";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown, Check, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";

interface LocalDropdownProps {
    server: LocalState;
}

export default function LocalDropdown({ server }: LocalDropdownProps) {
    const { currentProcesses, isLoading } = useAppSelector(
        (state) => state.processes,
    );

    const { selectedProcesses } = useAppSelector(
        (state) => state.modes.local[0],
    );

    const [filteredProcesses, setFilteredProcesses] = React.useState<Process[]>(
        [],
    );

    const [currentSearch, setCurrentSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);

    const dispatch = useAppDispatch();

    const { platform } = useAppSelector((state) => state.backendState);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCurrentSearch(e.target.value);
    };

    const extractProcessName = (process: Process) => {
        const separator = platform.startsWith("win32") ? "\\" : "/";
        return rpartition(process.executable, separator)[1];
    };

    const addProcessToSelection = (option: Process | string) => {
        const processName =
            typeof option === "string" ? option : extractProcessName(option);

        const newSelectedProcesses = selectedProcesses
            ? `${selectedProcesses}, ${processName}`
            : processName;

        dispatch(setSelectedProcesses({ server, value: newSelectedProcesses }));
    };

    const removeProcessFromSelection = (option: Process) => {
        const newSelectedProcesses = selectedProcesses
            ?.split(/,\s*/)
            .filter((app) => app !== extractProcessName(option))
            .join(", ");

        dispatch(setSelectedProcesses({ server, value: newSelectedProcesses }));
    };

    const handleApplicationClick = (option: Process) => {
        if (isSelected(option) && selectedProcesses) {
            removeProcessFromSelection(option);
        } else {
            addProcessToSelection(option);
        }
    };

    const isSelected = (option: Process) => {
        const processName = extractProcessName(option);
        return selectedProcesses?.includes(processName);
    };

    React.useEffect(() => {
        if (currentProcesses.length === 0) dispatch(fetchProcesses());
    }, []);

    React.useEffect(() => {
        if (currentSearch) {
            const filtered = currentProcesses.filter((option) =>
                extractProcessName(option)
                    .toLowerCase()
                    .includes(currentSearch.toLowerCase()),
            );
            setFilteredProcesses(filtered);
        } else if (filteredProcesses !== currentProcesses) {
            setFilteredProcesses(currentProcesses);
        }
    }, [currentSearch, currentProcesses]);

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        e.stopPropagation();
        if (e.key === "Enter") {
            addProcessToSelection(currentSearch);
            setCurrentSearch("");
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-8 gap-1 justify-between min-w-[150px]"
                >
                    <span className="text-xs truncate">
                        {selectedProcesses && selectedProcesses.length > 0
                            ? "Add more..."
                            : "All applications"}
                    </span>
                    <ChevronDown className="h-3 w-3 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-0" align="start">
                <div className="p-2 border-b border-border">
                    <Input
                        type="text"
                        placeholder="Search applications..."
                        value={currentSearch}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        className="h-8"
                    />
                </div>
                <div className="p-2">
                    <h4 className="text-xs font-medium text-muted-foreground mb-2">
                        Running Applications
                    </h4>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                    ) : filteredProcesses.length > 0 ? (
                        <ScrollArea className="h-[200px]">
                            <div className="space-y-1">
                                <button
                                    className={cn(
                                        "w-full flex items-center justify-between px-2 py-1.5 rounded text-sm",
                                        "hover:bg-accent cursor-pointer",
                                        selectedProcesses === "" && "bg-accent",
                                    )}
                                    onClick={() => {
                                        dispatch(
                                            setSelectedProcesses({
                                                server,
                                                value: "",
                                            }),
                                        );
                                    }}
                                >
                                    <span>All applications</span>
                                    {selectedProcesses === "" && (
                                        <Check className="h-4 w-4" />
                                    )}
                                </button>
                                <Separator className="my-1" />
                                {filteredProcesses.map((option, index) => (
                                    <button
                                        key={index}
                                        className={cn(
                                            "w-full flex items-center justify-between px-2 py-1.5 rounded text-sm",
                                            "hover:bg-accent cursor-pointer",
                                            isSelected(option) && "bg-accent",
                                        )}
                                        onClick={() =>
                                            handleApplicationClick(option)
                                        }
                                    >
                                        <div className="flex items-center gap-2">
                                            <img
                                                className="h-4 w-4"
                                                src={`./executable-icon?path=${option.executable}`}
                                                loading="lazy"
                                            />
                                            <span className="truncate">
                                                {extractProcessName(option)}
                                            </span>
                                        </div>
                                        {isSelected(option) && (
                                            <Check className="h-4 w-4 flex-shrink-0" />
                                        )}
                                    </button>
                                ))}
                            </div>
                        </ScrollArea>
                    ) : (
                        <p className="text-xs text-muted-foreground py-2">
                            Press <strong>Enter</strong> to capture traffic for
                            programs matching: <strong>{currentSearch}</strong>
                        </p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
}
