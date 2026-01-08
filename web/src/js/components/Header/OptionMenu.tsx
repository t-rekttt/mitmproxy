import * as React from "react";
import { CommandBarToggle, EventlogToggle, OptionsToggle } from "./MenuToggle";
import Button from "../common/Button";
import DocsLink from "../common/DocsLink";
import HideInStatic from "../common/HideInStatic";
import * as modalActions from "../../ducks/ui/modal";
import { useAppDispatch } from "../../ducks";
import { Settings } from "lucide-react";

OptionMenu.title = "Options";

export default function OptionMenu() {
    const dispatch = useAppDispatch();
    const openOptions = () => modalActions.setActiveModal("OptionModal");

    return (
        <div className="flex gap-6 p-2">
            <HideInStatic>
                <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        <Button
                            title="Open Options"
                            icon={Settings}
                            onClick={() => dispatch(openOptions())}
                        >
                            Edit Options <sup>alpha</sup>
                        </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">Options Editor</div>
                </div>

                <div className="flex flex-col gap-1">
                    <div className="flex flex-col gap-1">
                        <OptionsToggle name="anticache">
                            Strip cache headers{" "}
                            <DocsLink resource="overview/features/#anticache" />
                        </OptionsToggle>
                        <OptionsToggle name="showhost">
                            Use host header for display{" "}
                            <DocsLink resource="concepts/options/#showhost" />
                        </OptionsToggle>
                        <OptionsToggle name="ssl_insecure">
                            Don&apos;t verify server certificates{" "}
                            <DocsLink resource="concepts/options/#ssl_insecure" />
                        </OptionsToggle>
                    </div>
                    <div className="text-xs text-muted-foreground">Quick Options</div>
                </div>
            </HideInStatic>

            <div className="flex flex-col gap-1">
                <div className="flex flex-col gap-1">
                    <EventlogToggle />
                    <CommandBarToggle />
                </div>
                <div className="text-xs text-muted-foreground">View Options</div>
            </div>
        </div>
    );
}
