import type { Flow } from "../../flow";
import * as React from "react";
import ValueEditor from "../editors/ValueEditor";
import { useAppDispatch } from "../../ducks";
import * as flowActions from "../../ducks/flows";

export default function Comment({ flow }: { flow: Flow }) {
    const dispatch = useAppDispatch();

    return (
        <section className="p-4 space-y-4">
            <h4 className="text-sm font-semibold">Comment</h4>
            <ValueEditor
                className="flex-1 text-muted-foreground"
                content={flow.comment}
                onEditDone={(comment) => {
                    dispatch(flowActions.update(flow, { comment }));
                }}
                placeholder="empty"
                selectAllOnClick={true}
            />
        </section>
    );
}
Comment.displayName = "Comment";
