import type { HTTPFlow } from "../../flow";
import { formatTimeStamp } from "../../utils";
import * as React from "react";

type ErrorProps = {
    flow: HTTPFlow & { error: Error };
};

export default function Error({ flow }: ErrorProps) {
    return (
        <section className="p-4">
            <div className="p-4 rounded-md border border-yellow-500/50 bg-yellow-500/10 text-yellow-700 dark:text-yellow-400">
                <div className="font-medium">{flow.error.msg}</div>
                <div className="mt-1 text-sm text-yellow-600 dark:text-yellow-500">
                    {formatTimeStamp(flow.error.timestamp)}
                </div>
            </div>
        </section>
    );
}
Error.displayName = "Error";
