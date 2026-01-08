import * as React from "react";
import FileChooser from "../common/FileChooser";
import * as flowsActions from "../../ducks/flows";
import HideInStatic from "../common/HideInStatic";
import { useAppDispatch, useAppSelector } from "../../ducks";
import { FilterName } from "../../ducks/ui/filter";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
    ChevronDown,
    FolderOpen,
    Save,
    Trash2,
    ExternalLink,
} from "lucide-react";

export default React.memo(function FileMenu() {
    const dispatch = useAppDispatch();
    const filter = useAppSelector(
        (state) => state.ui.filter[FilterName.Search],
    );

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-1 h-8">
                    File
                    <ChevronDown className="h-3 w-3" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <FileChooser
                    variant="menu"
                    icon={<FolderOpen className="h-4 w-4 mr-2" />}
                    text="Open..."
                    onOpenFile={(file) => {
                        dispatch(flowsActions.upload(file));
                    }}
                />
                <DropdownMenuItem
                    onClick={() => location.replace("/flows/dump")}
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        location.replace("/flows/dump?filter=" + filter)
                    }
                >
                    <Save className="h-4 w-4 mr-2" />
                    Save filtered
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() =>
                        confirm("Delete all flows?") &&
                        dispatch(flowsActions.clear())
                    }
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear All
                </DropdownMenuItem>
                <HideInStatic>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <a
                            href="http://mitm.it/"
                            target="_blank"
                            rel="noreferrer"
                            className="flex items-center"
                        >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Install Certificates...
                        </a>
                    </DropdownMenuItem>
                </HideInStatic>
            </DropdownMenuContent>
        </DropdownMenu>
    );
});
