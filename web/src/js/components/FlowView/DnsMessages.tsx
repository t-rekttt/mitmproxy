import * as React from "react";

import { useAppSelector } from "../../ducks";
import type { DNSFlow, DNSMessage, DNSResourceRecord } from "../../flow";

const Summary: React.FC<{
    message: DNSMessage;
}> = ({ message }) => (
    <div>
        {message.query ? message.op_code : message.response_code}
        &nbsp;
        {message.truncation ? "(Truncated)" : ""}
    </div>
);

const Questions: React.FC<{
    message: DNSMessage;
}> = ({ message }) => (
    <div className="space-y-2">
        <h5 className="text-sm font-semibold">{message.recursion_desired ? "Recursive " : ""}Question</h5>
        <table className="w-full text-sm">
            <thead>
                <tr className="border-b border-border">
                    <th className="text-left py-1 font-medium text-muted-foreground">Name</th>
                    <th className="text-left py-1 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-1 font-medium text-muted-foreground">Class</th>
                </tr>
            </thead>
            <tbody>
                {message.questions.map((question, index) => (
                    <tr key={index} className="border-b border-border/50">
                        <td className="py-1">{question.name}</td>
                        <td className="py-1">{question.type}</td>
                        <td className="py-1">{question.class}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

const ResourceRecords: React.FC<{
    name: string;
    values: DNSResourceRecord[];
}> = ({ name, values }) => (
    <div className="space-y-2">
        <h5 className="text-sm font-semibold">{name}</h5>
        {values.length > 0 ? (
            <table className="w-full text-sm">
                <thead>
                    <tr className="border-b border-border">
                        <th className="text-left py-1 font-medium text-muted-foreground">Name</th>
                        <th className="text-left py-1 font-medium text-muted-foreground">Type</th>
                        <th className="text-left py-1 font-medium text-muted-foreground">Class</th>
                        <th className="text-left py-1 font-medium text-muted-foreground">TTL</th>
                        <th className="text-left py-1 font-medium text-muted-foreground">Data</th>
                    </tr>
                </thead>
                <tbody>
                    {values.map((rr, index) => (
                        <tr key={index} className="border-b border-border/50">
                            <td className="py-1">{rr.name}</td>
                            <td className="py-1">{rr.type}</td>
                            <td className="py-1">{rr.class}</td>
                            <td className="py-1">{rr.ttl}</td>
                            <td className="py-1">
                                {JSON.stringify(rr.data).replace(/^"|"$/g, "")}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        ) : (
            <span className="text-muted-foreground">—</span>
        )}
    </div>
);

const Message: React.FC<{
    type: "request" | "response";
    message: DNSMessage;
}> = ({ type, message }) => (
    <section className="p-4 space-y-4">
        <div className="px-4 py-2 font-mono text-sm bg-muted/30 border-b border-border rounded-t">
            <Summary message={message} />
        </div>
        <Questions message={message} />
        <div className="border-t border-border" />
        <ResourceRecords
            name={`${message.authoritative_answer ? "Authoritative " : ""}${
                message.recursion_available ? "Recursive " : ""
            }Answer`}
            values={message.answers}
        />
        <div className="border-t border-border" />
        <ResourceRecords name="Authority" values={message.authorities} />
        <div className="border-t border-border" />
        <ResourceRecords name="Additional" values={message.additionals} />
    </section>
);

export function Request() {
    const flow = useAppSelector((state) => state.flows.selected[0]) as DNSFlow;
    return <Message type="request" message={flow.request} />;
}

Request.displayName = "Request";

export function Response() {
    const flow = useAppSelector(
        (state) => state.flows.selected[0],
    ) as DNSFlow & { response: DNSMessage };
    return <Message type="response" message={flow.response} />;
}

Response.displayName = "Response";
